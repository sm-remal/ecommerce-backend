import { z } from "zod";
import { AppError } from "../../utility/AppError";
import type { ContactSubmissionPayload } from "./contact.interface";

const contactSubmissionSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(120),
    phone: z.string().trim().min(5, "Phone number is required").max(20),
    email: z.string().trim().email().optional(),
    subject: z.string().trim().max(160).optional(),
    message: z.string().trim().min(1, "Message is required").max(2000),
    address: z.string().trim().max(500).optional(),
});

const formatZodMessage = (error: z.ZodError) => error.issues.map((issue) => issue.message).join(", ");

export const parseContactSubmissionPayload = (payload: unknown): ContactSubmissionPayload => {
    try {
        const parsed = contactSubmissionSchema.parse(payload);

        return {
            name: parsed.name,
            phone: parsed.phone,
            message: parsed.message,
            ...(typeof parsed.email !== "undefined" ? { email: parsed.email } : {}),
            ...(typeof parsed.subject !== "undefined" ? { subject: parsed.subject } : {}),
            ...(typeof parsed.address !== "undefined" ? { address: parsed.address } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};
