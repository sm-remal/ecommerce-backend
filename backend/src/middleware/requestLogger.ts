import crypto from "node:crypto";
import type { RequestHandler } from "express";

const sensitiveHeaders = new Set(["authorization", "cookie", "set-cookie"]);

const getSafeHeaders = (headers: Record<string, unknown>) => Object.entries(headers).reduce<Record<string, unknown>>((safe, [key, value]) => {
    safe[key] = sensitiveHeaders.has(key.toLowerCase()) ? "[redacted]" : value;
    return safe;
}, {});

export const requestLogger: RequestHandler = (req, res, next) => {
    const requestId = req.headers["x-request-id"]?.toString() || crypto.randomUUID();
    const startedAt = Date.now();

    req.headers["x-request-id"] = requestId;
    res.setHeader("X-Request-Id", requestId);

    res.on("finish", () => {
        const durationMs = Date.now() - startedAt;
        const logPayload = {
            requestId,
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs,
            ip: req.ip,
            headers: getSafeHeaders(req.headers),
        };

        console.info(JSON.stringify(logPayload));
    });

    next();
};
