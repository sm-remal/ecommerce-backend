import { z } from "zod";
import { AppError } from "../../utility/AppError";
import type { CountMetric, ReportQuery } from "./report.interface";

const reportQuerySchema = z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
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

export const parseReportQuery = (query: unknown): ReportQuery => {
    try {
        const parsed = reportQuerySchema.parse(query);

        return {
            ...(typeof parsed.startDate !== "undefined" ? { startDate: parsed.startDate } : {}),
            ...(typeof parsed.endDate !== "undefined" ? { endDate: parsed.endDate } : {}),
            ...(typeof parsed.limit !== "undefined" ? { limit: parsed.limit } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const buildDateRangeWhere = (query: ReportQuery) => {
    const createdAt: Record<string, Date> = {};

    if (query.startDate) {
        createdAt.gte = query.startDate;
    }

    if (query.endDate) {
        createdAt.lte = query.endDate;
    }

    return Object.keys(createdAt).length ? { createdAt } : {};
};

export const toCountMetrics = <T extends { count: number }>(
    rows: T[],
    getLabel: (row: T) => string | null | undefined,
): CountMetric[] => rows.map((row) => ({
    label: getLabel(row) || "Unknown",
    count: row.count,
}));

export const getDateRange = (query: ReportQuery) => ({
    ...(query.startDate ? { startDate: query.startDate } : {}),
    ...(query.endDate ? { endDate: query.endDate } : {}),
});

export const getReportLimit = (query: ReportQuery, fallback = 10) => query.limit ?? fallback;
