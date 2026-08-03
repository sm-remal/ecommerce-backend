import { z } from "zod";
import { AppError } from "../../utility/AppError";
import type { DashboardQuery } from "./dashboard.interface";

const dashboardQuerySchema = z.object({
    limit: z.coerce.number().int().positive().max(50).optional(),
    days: z.coerce.number().int().positive().max(365).optional(),
});

const formatZodMessage = (error: z.ZodError) => error.issues.map((issue) => issue.message).join(", ");

export const parseDashboardQuery = (query: unknown): DashboardQuery => {
    try {
        const parsed = dashboardQuerySchema.parse(query);

        return {
            ...(typeof parsed.limit !== "undefined" ? { limit: parsed.limit } : {}),
            ...(typeof parsed.days !== "undefined" ? { days: parsed.days } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const getDashboardLimit = (query: DashboardQuery, fallback = 5) => query.limit ?? fallback;

export const getDashboardDays = (query: DashboardQuery, fallback = 30) => query.days ?? fallback;
