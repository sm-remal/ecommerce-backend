import type { RequestHandler } from "express";
import type { z } from "zod";

type RequestPart = "body" | "query" | "params";

type Parser<T = unknown> = (value: unknown) => T | Promise<T>;

type Validator<T = unknown> = z.ZodType<T> | Parser<T>;

type ValidationSchema = Partial<Record<RequestPart, Validator>>;

const isZodSchema = (validator: Validator): validator is z.ZodType => (
    typeof validator === "object"
    && validator !== null
    && "safeParse" in validator
    && typeof validator.safeParse === "function"
);

const parseValue = async (validator: Validator, value: unknown) => {
    if (isZodSchema(validator)) {
        const parsed = validator.safeParse(value);

        if (!parsed.success) {
            throw parsed.error;
        }

        return parsed.data;
    }

    const parsed = await validator(value);

    return typeof parsed === "undefined" ? value : parsed;
};

export const validateRequest = (schema: ValidationSchema): RequestHandler => async (req, res, next) => {
    try {
        const parts = Object.entries(schema) as [RequestPart, Validator][];

        for (const [part, validator] of parts) {
            req[part] = await parseValue(validator, req[part]);
        }

        next();
    } catch (error) {
        next(error);
    }
};
