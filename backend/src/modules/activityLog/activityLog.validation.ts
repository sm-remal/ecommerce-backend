import { z } from "zod";
import { AppError } from "../../utility/AppError";
import type {
    ActivityLogFilters,
    ActivityLogItem,
    CreateActivityLogPayload,
} from "./activityLog.interface";

const activityActions = ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"] as const;

const createActivityLogSchema = z.object({
    adminId: z.union([z.string().trim().min(1), z.null()]).optional(),
    adminName: z.string().trim().min(1).max(120).optional(),
    action: z.enum(activityActions),
    module: z.string().trim().min(1).max(80),
    description: z.string().trim().min(1).max(2000),
    ipAddress: z.union([z.string().trim().max(80), z.null()]).optional(),
});

const activityLogQuerySchema = z.object({
    search: z.string().trim().optional(),
    adminId: z.string().trim().optional(),
    action: z.enum(activityActions).optional(),
    module: z.string().trim().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
}).superRefine((query, context) => {
    if (query.startDate && query.endDate && query.endDate < query.startDate) {
        context.addIssue({
            code: "custom",
            message: "End date must be after start date",
            path: ["endDate"],
        });
    }
});

const formatZodMessage = (error: z.ZodError) => error.issues.map((issue) => issue.message).join(", ");

export const parseCreateActivityLogPayload = (payload: unknown): CreateActivityLogPayload => {
    try {
        const parsed = createActivityLogSchema.parse(payload);

        return {
            action: parsed.action,
            module: parsed.module,
            description: parsed.description,
            ...(typeof parsed.adminId !== "undefined" ? { adminId: parsed.adminId } : {}),
            ...(typeof parsed.adminName !== "undefined" ? { adminName: parsed.adminName } : {}),
            ...(typeof parsed.ipAddress !== "undefined" ? { ipAddress: parsed.ipAddress } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseActivityLogFilters = (query: unknown): ActivityLogFilters => {
    try {
        const parsed = activityLogQuerySchema.parse(query);

        return {
            ...(parsed.search ? { search: parsed.search } : {}),
            ...(parsed.adminId ? { adminId: parsed.adminId } : {}),
            ...(parsed.action ? { action: parsed.action } : {}),
            ...(parsed.module ? { module: parsed.module } : {}),
            ...(typeof parsed.startDate !== "undefined" ? { startDate: parsed.startDate } : {}),
            ...(typeof parsed.endDate !== "undefined" ? { endDate: parsed.endDate } : {}),
            ...(typeof parsed.page !== "undefined" ? { page: parsed.page } : {}),
            ...(typeof parsed.limit !== "undefined" ? { limit: parsed.limit } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const buildActivityLogWhereClause = (filters: ActivityLogFilters) => {
    const where: Record<string, unknown> = {};
    const createdAt: Record<string, Date> = {};

    if (filters.adminId) {
        where.adminId = filters.adminId;
    }

    if (filters.action) {
        where.action = filters.action;
    }

    if (filters.module) {
        where.module = { contains: filters.module };
    }

    if (filters.startDate) {
        createdAt.gte = filters.startDate;
    }

    if (filters.endDate) {
        createdAt.lte = filters.endDate;
    }

    if (Object.keys(createdAt).length) {
        where.createdAt = createdAt;
    }

    if (filters.search?.trim()) {
        const search = filters.search.trim();
        where.OR = [
            { adminName: { contains: search } },
            { module: { contains: search } },
            { description: { contains: search } },
            { ipAddress: { contains: search } },
        ];
    }

    return where;
};

export const buildActivityLogPagination = (filters: ActivityLogFilters) => {
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    return {
        page,
        limit,
        skip: (page - 1) * limit,
    };
};

export const activityLogInclude = {
    admin: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
};

export const mapActivityLog = (log: any): ActivityLogItem => ({
    id: log.id,
    adminId: log.adminId,
    adminName: log.adminName,
    action: log.action,
    module: log.module,
    description: log.description,
    ipAddress: log.ipAddress,
    createdAt: log.createdAt,
    admin: log.admin,
});
