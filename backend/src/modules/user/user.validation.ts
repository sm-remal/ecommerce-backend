import { z } from "zod";
import { AppError } from "../../utility/AppError";
import type {
    CreateUserPayload,
    UpdateProfilePayload,
    UpdateUserPayload,
    UserItem,
    UserListFilters,
    UserRole,
    UserStatus,
} from "./user.interface";

type UserRecord = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    type: UserRole;
    status: UserStatus;
    emailVerifiedAt: Date | null;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

const userRoles = ["USER", "ADMIN"] as const;
const userStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;

const createUserSchema = z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()),
    password: z.string().min(8),
    phone: z.string().trim().max(20).optional(),
    avatar: z.string().trim().optional(),
    type: z.enum(userRoles).optional(),
    status: z.enum(userStatuses).optional(),
});

const updateUserSchema = createUserSchema.partial();

const updateProfileSchema = z.object({
    name: z.string().trim().min(1).max(120).optional(),
    phone: z.string().trim().max(20).optional(),
    avatar: z.string().trim().optional(),
});

const userListQuerySchema = z.object({
    search: z.string().trim().optional(),
    type: z.enum(userRoles).optional(),
    status: z.enum(userStatuses).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
});

const formatZodMessage = (error: z.ZodError) => error.issues.map((issue) => issue.message).join(", ");

export const parseCreateUserPayload = (payload: unknown): CreateUserPayload => {
    try {
        const parsed = createUserSchema.parse(payload);

        return {
            name: parsed.name,
            email: parsed.email,
            password: parsed.password,
            ...(typeof parsed.phone !== "undefined" ? { phone: parsed.phone } : {}),
            ...(typeof parsed.avatar !== "undefined" ? { avatar: parsed.avatar } : {}),
            ...(typeof parsed.type !== "undefined" ? { type: parsed.type } : {}),
            ...(typeof parsed.status !== "undefined" ? { status: parsed.status } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseUpdateUserPayload = (payload: unknown): UpdateUserPayload => {
    try {
        const parsed = updateUserSchema.parse(payload);

        return {
            ...(typeof parsed.name !== "undefined" ? { name: parsed.name } : {}),
            ...(typeof parsed.email !== "undefined" ? { email: parsed.email } : {}),
            ...(typeof parsed.password !== "undefined" ? { password: parsed.password } : {}),
            ...(typeof parsed.phone !== "undefined" ? { phone: parsed.phone } : {}),
            ...(typeof parsed.avatar !== "undefined" ? { avatar: parsed.avatar } : {}),
            ...(typeof parsed.type !== "undefined" ? { type: parsed.type } : {}),
            ...(typeof parsed.status !== "undefined" ? { status: parsed.status } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseUpdateProfilePayload = (payload: unknown): UpdateProfilePayload => {
    try {
        const parsed = updateProfileSchema.parse(payload);

        return {
            ...(typeof parsed.name !== "undefined" ? { name: parsed.name } : {}),
            ...(typeof parsed.phone !== "undefined" ? { phone: parsed.phone } : {}),
            ...(typeof parsed.avatar !== "undefined" ? { avatar: parsed.avatar } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseUserListFilters = (query: unknown): UserListFilters => {
    try {
        const parsed = userListQuerySchema.parse(query);

        return {
            ...(parsed.search ? { search: parsed.search } : {}),
            ...(parsed.type ? { type: parsed.type } : {}),
            ...(parsed.status ? { status: parsed.status } : {}),
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

export const mapUser = (user: UserRecord): UserItem => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    type: user.type,
    status: user.status,
    emailVerifiedAt: user.emailVerifiedAt,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export const buildUserWhereClause = (filters: UserListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.type) {
        where.type = filters.type;
    }

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.search?.trim()) {
        const search = filters.search.trim();
        where.OR = [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
        ];
    }

    return where;
};
