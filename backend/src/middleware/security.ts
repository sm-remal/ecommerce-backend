import crypto from "node:crypto";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { createClient, type RedisClientType } from "redis";
import config from "../config";
import { AppError } from "../utility/AppError";

type RateLimitRecord = {
    count: number;
    resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitRecord>();
const defaultWindowMs = 15 * 60 * 1000;
const defaultMaxRequests = 300;
const authMaxRequests = 50;
const cleanupIntervalMs = 5 * 60 * 1000;
let lastCleanupAt = Date.now();
let redisClient: RedisClientType | undefined;
let redisConnectPromise: Promise<RedisClientType> | undefined;

const isPlainObject = (value: unknown): value is Record<string, unknown> => (
    typeof value === "object"
    && value !== null
    && !Array.isArray(value)
    && !(value instanceof Date)
);

const dangerousKeys = new Set(["__proto__", "prototype", "constructor"]);

const stripDangerousHtml = (value: string) => value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript\s*:/gi, "");

const sanitizeValue = (value: unknown): unknown => {
    if (typeof value === "string") {
        return stripDangerousHtml(value);
    }

    if (Array.isArray(value)) {
        return value.map((item) => sanitizeValue(item));
    }

    if (isPlainObject(value)) {
        return Object.entries(value).reduce<Record<string, unknown>>((sanitized, [key, item]) => {
            if (!dangerousKeys.has(key)) {
                sanitized[key] = sanitizeValue(item);
            }

            return sanitized;
        }, {});
    }

    return value;
};

const getClientIp = (req: Request) => {
    const forwardedFor = req.headers["x-forwarded-for"];
    const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(",")[0];

    return ip?.trim() || req.ip || req.socket.remoteAddress || "unknown";
};

const cleanupRateLimitStore = () => {
    const now = Date.now();

    if (now - lastCleanupAt < cleanupIntervalMs) {
        return;
    }

    for (const [key, record] of rateLimitStore.entries()) {
        if (record.resetAt <= now) {
            rateLimitStore.delete(key);
        }
    }

    lastCleanupAt = now;
};

const getRedisClient = async () => {
    if (!config.redis_url) {
        return undefined;
    }

    if (redisClient?.isOpen) {
        return redisClient;
    }

    if (!redisConnectPromise) {
        const client = createClient({ url: config.redis_url });
        client.on("error", (error) => {
            console.error("Redis rate limiter error", error);
        });

        redisConnectPromise = client.connect().then(() => {
            redisClient = client as RedisClientType;
            return redisClient;
        });
    }

    return redisConnectPromise;
};

const incrementRedisRateLimit = async (key: string, windowMs: number) => {
    const client = await getRedisClient();

    if (!client) {
        return undefined;
    }

    const count = await client.incr(key);
    if (count === 1) {
        await client.pExpire(key, windowMs);
    }

    const ttl = await client.pTTL(key);

    return {
        count,
        resetAt: Date.now() + Math.max(ttl, 0),
    };
};

export const securityHeaders: RequestHandler = (req, res, next) => {
    const nonce = crypto.randomBytes(16).toString("base64");
    res.locals.cspNonce = nonce;

    res.setHeader("Content-Security-Policy", [
        "default-src 'self'",
        "base-uri 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "img-src 'self' data: https:",
        `script-src 'self' 'nonce-${nonce}'`,
        "style-src 'self' 'unsafe-inline'",
        "connect-src 'self'",
    ].join("; "));
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    res.setHeader("Origin-Agent-Cluster", "?1");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-DNS-Prefetch-Control", "off");
    res.setHeader("X-Download-Options", "noopen");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
    res.setHeader("X-XSS-Protection", "0");
    res.removeHeader("X-Powered-By");

    next();
};

export const requestSanitizer: RequestHandler = (req, res, next) => {
    if (req.body) {
        req.body = sanitizeValue(req.body);
    }

    if (req.params) {
        req.params = sanitizeValue(req.params) as Request["params"];
    }

    next();
};

export const rateLimiter = (options: {
    windowMs?: number;
    maxRequests?: number;
    keyPrefix?: string;
} = {}): RequestHandler => {
    const windowMs = options.windowMs || defaultWindowMs;
    const maxRequests = options.maxRequests || defaultMaxRequests;
    const keyPrefix = options.keyPrefix || "global";

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            cleanupRateLimitStore();

            const now = Date.now();
            const key = `${keyPrefix}:${getClientIp(req)}`;
            const redisRecord = await incrementRedisRateLimit(key, windowMs);
            const record = redisRecord || (() => {
                const current = rateLimitStore.get(key);
                const memoryRecord = current && current.resetAt > now
                    ? current
                    : { count: 0, resetAt: now + windowMs };

                memoryRecord.count += 1;
                rateLimitStore.set(key, memoryRecord);

                return memoryRecord;
            })();

            const remaining = Math.max(maxRequests - record.count, 0);
            res.setHeader("RateLimit-Limit", String(maxRequests));
            res.setHeader("RateLimit-Remaining", String(remaining));
            res.setHeader("RateLimit-Reset", String(Math.ceil(record.resetAt / 1000)));

            if (record.count > maxRequests) {
                next(new AppError(429, "Too many requests, please try again later"));
                return;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export const authRateLimiter = rateLimiter({
    maxRequests: authMaxRequests,
    keyPrefix: "auth",
});

export const getCorsOrigin = () => {
    if (!config.app_url) {
        return config.node_env === "production" ? false : true;
    }

    return config.app_url.split(",").map((origin) => origin.trim()).filter(Boolean);
};
