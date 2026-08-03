import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import config from "../config";
import { AppError } from "../utility/AppError";
import { responseMessages } from "../utility/responseMessages";

type ErrorResponse = {
    success: false;
    message: string;
    error?: unknown;
    stack?: string;
};

const getStatusCode = (error: unknown) => {
    if (error instanceof AppError) {
        return error.statusCode;
    }

    if (error instanceof ZodError) {
        return 400;
    }

    if (error instanceof SyntaxError && "body" in error) {
        return 400;
    }

    if (typeof error === "object" && error !== null && "code" in error) {
        const code = String((error as { code?: unknown }).code);

        if (code === "P2002") {
            return 409;
        }

        if (code === "P2025") {
            return 404;
        }
    }

    return 500;
};

const getErrorMessage = (error: unknown, statusCode: number) => {
    if (error instanceof ZodError) {
        return error.issues[0]?.message || responseMessages.common.invalidInput;
    }

    if (error instanceof SyntaxError && "body" in error) {
        return "Invalid JSON payload";
    }

    if (typeof error === "object" && error !== null && "code" in error) {
        const code = String((error as { code?: unknown }).code);

        if (code === "P2002") {
            return "Duplicate value already exists";
        }

        if (code === "P2025") {
            return responseMessages.common.notFound;
        }
    }

    if (error instanceof Error) {
        return error.message || responseMessages.common.serverError;
    }

    return statusCode >= 500 ? responseMessages.common.serverError : responseMessages.common.invalidInput;
};

export const notFoundHandler: RequestHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
};

export const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    const statusCode = getStatusCode(error);
    const payload: ErrorResponse = {
        success: false,
        message: getErrorMessage(error, statusCode),
        ...(error instanceof ZodError ? { error: error.issues } : {}),
        ...(config.node_env === "development" && error instanceof Error ? { stack: error.stack } : {}),
    };

    res.status(statusCode).json(payload);
};
