import { z } from "zod";
import { AppError } from "../../utility/AppError";
import type { NotificationQuery } from "./notification.interface";

const notificationTypes = ["ORDER", "REVIEW", "STOCK", "COUPON", "DISCOUNT", "BANNER", "SYSTEM"] as const;
const notificationSeverities = ["INFO", "WARNING", "CRITICAL"] as const;

const notificationQuerySchema = z.object({
    type: z.enum(notificationTypes).optional(),
    severity: z.enum(notificationSeverities).optional(),
    readStatus: z.enum(["READ", "UNREAD", "ALL"]).optional(),
    includeDismissed: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    days: z.coerce.number().int().positive().max(90).optional(),
});

const formatZodMessage = (error: z.ZodError) => error.issues.map((issue) => issue.message).join(", ");

export const parseNotificationQuery = (query: unknown): NotificationQuery => {
    try {
        const parsed = notificationQuerySchema.parse(query);

        return {
            ...(parsed.type ? { type: parsed.type } : {}),
            ...(parsed.severity ? { severity: parsed.severity } : {}),
            ...(parsed.readStatus ? { readStatus: parsed.readStatus } : {}),
            ...(typeof parsed.includeDismissed !== "undefined" ? { includeDismissed: parsed.includeDismissed } : {}),
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

export const getNotificationLimit = (query: NotificationQuery, fallback = 20) => query.limit ?? fallback;

export const getExpiryDateLimit = (query: NotificationQuery) => {
    const date = new Date();
    date.setDate(date.getDate() + (query.days ?? 7));

    return date;
};
