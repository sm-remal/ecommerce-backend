import { z } from "zod";

const emailSchema = z.string().trim().email().transform((value) => value.toLowerCase());
const passwordSchema = z.string().min(8);

export const registerSchema = z.object({
    name: z.string().trim().min(1).max(120),
    email: emailSchema,
    password: passwordSchema,
    phone: z.string().trim().max(20).optional(),
});

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

export const resetPasswordSchema = z.object({
    token: z.string().trim().min(1),
    password: passwordSchema,
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema,
});
