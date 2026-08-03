import { z } from "zod";
import { AppError } from "../../utility/AppError";
import type {
    CouponItem,
    CouponListFilters,
    CouponType,
    CreateCouponPayload,
    UpdateCouponPayload,
    ValidateCouponPayload,
} from "./coupon.interface";

type CouponRecord = {
    id: string;
    code: string;
    type: CouponType;
    value: unknown;
    minOrderAmount: unknown | null;
    maxDiscountAmount: unknown | null;
    usageLimit: number | null;
    usedCount: number;
    startDate: Date;
    endDate: Date;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
};

const couponTypes = ["PERCENTAGE", "FIXED"] as const;

const optionalAmountSchema = z
    .union([z.coerce.number().nonnegative(), z.null()])
    .optional();

const optionalPositiveIntSchema = z
    .union([z.coerce.number().int().positive(), z.null()])
    .optional();

const dateSchema = z.coerce.date();

const couponBaseSchema = z.object({
    code: z.string().trim().min(2).max(80).transform((value) => value.toUpperCase()),
    type: z.enum(couponTypes),
    value: z.coerce.number().positive(),
    minOrderAmount: optionalAmountSchema,
    maxDiscountAmount: optionalAmountSchema,
    usageLimit: optionalPositiveIntSchema,
    usedCount: z.coerce.number().int().nonnegative().optional(),
    startDate: dateSchema,
    endDate: dateSchema,
    status: z.boolean().optional(),
});

export const createCouponSchema = couponBaseSchema.superRefine((payload, context) => {
    if (payload.type === "PERCENTAGE" && payload.value > 100) {
        context.addIssue({
            code: "custom",
            message: "Percentage coupon value cannot be greater than 100",
            path: ["value"],
        });
    }

    if (payload.endDate < payload.startDate) {
        context.addIssue({
            code: "custom",
            message: "Coupon end date must be after start date",
            path: ["endDate"],
        });
    }
});

export const updateCouponSchema = couponBaseSchema.partial().superRefine((payload, context) => {
    if (payload.type === "PERCENTAGE" && typeof payload.value !== "undefined" && payload.value > 100) {
        context.addIssue({
            code: "custom",
            message: "Percentage coupon value cannot be greater than 100",
            path: ["value"],
        });
    }

    if (payload.startDate && payload.endDate && payload.endDate < payload.startDate) {
        context.addIssue({
            code: "custom",
            message: "Coupon end date must be after start date",
            path: ["endDate"],
        });
    }
});

export const validateCouponSchema = z.object({
    code: z.string().trim().min(2).max(80).transform((value) => value.toUpperCase()),
    orderAmount: z.coerce.number().nonnegative().optional(),
});

export const couponListQuerySchema = z.object({
    search: z.string().trim().optional(),
    type: z.enum(couponTypes).optional(),
    status: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
    activeNow: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
});

const formatZodMessage = (error: z.ZodError) => error.issues.map((issue) => issue.message).join(", ");

export const parseCreateCouponPayload = (payload: unknown): CreateCouponPayload => {
    try {
        const parsed = createCouponSchema.parse(payload);

        return {
            code: parsed.code,
            type: parsed.type,
            value: parsed.value,
            startDate: parsed.startDate,
            endDate: parsed.endDate,
            ...(typeof parsed.minOrderAmount !== "undefined" ? { minOrderAmount: parsed.minOrderAmount } : {}),
            ...(typeof parsed.maxDiscountAmount !== "undefined" ? { maxDiscountAmount: parsed.maxDiscountAmount } : {}),
            ...(typeof parsed.usageLimit !== "undefined" ? { usageLimit: parsed.usageLimit } : {}),
            ...(typeof parsed.usedCount !== "undefined" ? { usedCount: parsed.usedCount } : {}),
            ...(typeof parsed.status !== "undefined" ? { status: parsed.status } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseUpdateCouponPayload = (payload: unknown): UpdateCouponPayload => {
    try {
        const parsed = updateCouponSchema.parse(payload);

        return {
            ...(typeof parsed.code !== "undefined" ? { code: parsed.code } : {}),
            ...(typeof parsed.type !== "undefined" ? { type: parsed.type } : {}),
            ...(typeof parsed.value !== "undefined" ? { value: parsed.value } : {}),
            ...(typeof parsed.minOrderAmount !== "undefined" ? { minOrderAmount: parsed.minOrderAmount } : {}),
            ...(typeof parsed.maxDiscountAmount !== "undefined" ? { maxDiscountAmount: parsed.maxDiscountAmount } : {}),
            ...(typeof parsed.usageLimit !== "undefined" ? { usageLimit: parsed.usageLimit } : {}),
            ...(typeof parsed.usedCount !== "undefined" ? { usedCount: parsed.usedCount } : {}),
            ...(typeof parsed.startDate !== "undefined" ? { startDate: parsed.startDate } : {}),
            ...(typeof parsed.endDate !== "undefined" ? { endDate: parsed.endDate } : {}),
            ...(typeof parsed.status !== "undefined" ? { status: parsed.status } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseValidateCouponPayload = (payload: unknown): ValidateCouponPayload => {
    try {
        const parsed = validateCouponSchema.parse(payload);

        return {
            code: parsed.code,
            ...(typeof parsed.orderAmount !== "undefined" ? { orderAmount: parsed.orderAmount } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseCouponListFilters = (query: unknown): CouponListFilters => {
    try {
        const parsed = couponListQuerySchema.parse(query);

        return {
            ...(parsed.search ? { search: parsed.search } : {}),
            ...(parsed.type ? { type: parsed.type } : {}),
            ...(typeof parsed.status !== "undefined" ? { status: parsed.status } : {}),
            ...(typeof parsed.activeNow !== "undefined" ? { activeNow: parsed.activeNow } : {}),
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

export const mapCoupon = (coupon: CouponRecord): CouponItem => ({
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: Number(coupon.value),
    minOrderAmount: coupon.minOrderAmount === null ? null : Number(coupon.minOrderAmount),
    maxDiscountAmount: coupon.maxDiscountAmount === null ? null : Number(coupon.maxDiscountAmount),
    usageLimit: coupon.usageLimit,
    usedCount: coupon.usedCount,
    startDate: coupon.startDate,
    endDate: coupon.endDate,
    status: coupon.status,
    createdAt: coupon.createdAt,
    updatedAt: coupon.updatedAt,
});

export const buildCouponWhereClause = (filters: CouponListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.type) {
        where.type = filters.type;
    }

    if (typeof filters.status !== "undefined") {
        where.status = filters.status;
    }

    if (filters.activeNow) {
        const now = new Date();
        where.status = true;
        where.startDate = { lte: now };
        where.endDate = { gte: now };
    }

    if (filters.search?.trim()) {
        where.OR = [
            { code: { contains: filters.search.trim().toUpperCase() } },
        ];
    }

    return where;
};

export const buildCreateCouponData = (payload: CreateCouponPayload) => ({
    code: payload.code.toUpperCase(),
    type: payload.type,
    value: Number(payload.value),
    minOrderAmount: payload.minOrderAmount ?? null,
    maxDiscountAmount: payload.maxDiscountAmount ?? null,
    usageLimit: payload.usageLimit ?? null,
    usedCount: Number(payload.usedCount || 0),
    startDate: new Date(payload.startDate),
    endDate: new Date(payload.endDate),
    status: typeof payload.status === "undefined" ? true : payload.status,
});

export const buildUpdateCouponData = (payload: UpdateCouponPayload) => ({
    ...(typeof payload.code !== "undefined" ? { code: payload.code.toUpperCase() } : {}),
    ...(typeof payload.type !== "undefined" ? { type: payload.type } : {}),
    ...(typeof payload.value !== "undefined" ? { value: Number(payload.value) } : {}),
    ...(typeof payload.minOrderAmount !== "undefined" ? { minOrderAmount: payload.minOrderAmount } : {}),
    ...(typeof payload.maxDiscountAmount !== "undefined" ? { maxDiscountAmount: payload.maxDiscountAmount } : {}),
    ...(typeof payload.usageLimit !== "undefined" ? { usageLimit: payload.usageLimit } : {}),
    ...(typeof payload.usedCount !== "undefined" ? { usedCount: Number(payload.usedCount) } : {}),
    ...(typeof payload.startDate !== "undefined" ? { startDate: new Date(payload.startDate) } : {}),
    ...(typeof payload.endDate !== "undefined" ? { endDate: new Date(payload.endDate) } : {}),
    ...(typeof payload.status !== "undefined" ? { status: payload.status } : {}),
});
