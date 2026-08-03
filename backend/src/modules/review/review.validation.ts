import { z } from "zod";
import { AppError } from "../../utility/AppError";
import type {
    CreateReviewPayload,
    ReviewItem,
    ReviewListFilters,
    ReviewStats,
    UpdateReviewPayload,
    UpdateReviewStatusPayload,
} from "./review.interface";

type ReviewRecord = {
    id: string;
    productId: string;
    customerName: string;
    email: string | null;
    rating: number;
    comment: string | null;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    product: {
        id: string;
        name: string;
        slug: string;
        sku: string;
    };
};

const reviewBaseSchema = z.object({
    productId: z.string().trim().min(1),
    customerName: z.string().trim().min(1).max(120),
    email: z.string().trim().email().optional(),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().optional(),
    status: z.boolean().optional(),
});

export const createReviewSchema = reviewBaseSchema;

export const updateReviewSchema = reviewBaseSchema.partial();

export const updateReviewStatusSchema = z.object({
    status: z.boolean(),
});

export const reviewListQuerySchema = z.object({
    search: z.string().trim().optional(),
    productId: z.string().trim().optional(),
    status: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
});

const formatZodMessage = (error: z.ZodError) => error.issues.map((issue) => issue.message).join(", ");

export const parseCreateReviewPayload = (payload: unknown): CreateReviewPayload => {
    try {
        const parsed = createReviewSchema.parse(payload);

        return {
            productId: parsed.productId,
            customerName: parsed.customerName,
            rating: parsed.rating,
            ...(typeof parsed.email !== "undefined" ? { email: parsed.email } : {}),
            ...(typeof parsed.comment !== "undefined" ? { comment: parsed.comment } : {}),
            ...(typeof parsed.status !== "undefined" ? { status: parsed.status } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseUpdateReviewPayload = (payload: unknown): UpdateReviewPayload => {
    try {
        const parsed = updateReviewSchema.parse(payload);

        return {
            ...(typeof parsed.productId !== "undefined" ? { productId: parsed.productId } : {}),
            ...(typeof parsed.customerName !== "undefined" ? { customerName: parsed.customerName } : {}),
            ...(typeof parsed.email !== "undefined" ? { email: parsed.email } : {}),
            ...(typeof parsed.rating !== "undefined" ? { rating: parsed.rating } : {}),
            ...(typeof parsed.comment !== "undefined" ? { comment: parsed.comment } : {}),
            ...(typeof parsed.status !== "undefined" ? { status: parsed.status } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseUpdateReviewStatusPayload = (payload: unknown): UpdateReviewStatusPayload => {
    try {
        return updateReviewStatusSchema.parse(payload);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseReviewListFilters = (query: unknown): ReviewListFilters => {
    try {
        const parsed = reviewListQuerySchema.parse(query);

        return {
            ...(parsed.search ? { search: parsed.search } : {}),
            ...(parsed.productId ? { productId: parsed.productId } : {}),
            ...(typeof parsed.status !== "undefined" ? { status: parsed.status } : {}),
            ...(typeof parsed.rating !== "undefined" ? { rating: parsed.rating } : {}),
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

export const reviewInclude = {
    product: {
        select: {
            id: true,
            name: true,
            slug: true,
            sku: true,
        },
    },
};

export const mapReview = (review: ReviewRecord): ReviewItem => ({
    id: review.id,
    productId: review.productId,
    customerName: review.customerName,
    email: review.email,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    product: review.product,
});

export const buildReviewWhereClause = (filters: ReviewListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.productId) {
        where.productId = filters.productId;
    }

    if (typeof filters.status !== "undefined") {
        where.status = filters.status;
    }

    if (typeof filters.rating !== "undefined") {
        where.rating = filters.rating;
    }

    if (filters.search?.trim()) {
        const search = filters.search.trim();
        where.OR = [
            { customerName: { contains: search } },
            { email: { contains: search } },
            { comment: { contains: search } },
        ];
    }

    return where;
};

export const buildCreateReviewData = (payload: CreateReviewPayload) => ({
    productId: payload.productId,
    customerName: payload.customerName.trim(),
    email: payload.email?.trim() || null,
    rating: payload.rating,
    comment: payload.comment?.trim() || null,
    status: typeof payload.status === "undefined" ? false : payload.status,
});

export const buildUpdateReviewData = (payload: UpdateReviewPayload) => ({
    ...(typeof payload.productId !== "undefined" ? { productId: payload.productId } : {}),
    ...(typeof payload.customerName !== "undefined" ? { customerName: payload.customerName.trim() } : {}),
    ...(typeof payload.email !== "undefined" ? { email: payload.email?.trim() || null } : {}),
    ...(typeof payload.rating !== "undefined" ? { rating: payload.rating } : {}),
    ...(typeof payload.comment !== "undefined" ? { comment: payload.comment?.trim() || null } : {}),
    ...(typeof payload.status !== "undefined" ? { status: payload.status } : {}),
});

export const mapReviewStats = (productId: string, totalReviews: number, averageRating: number | null): ReviewStats => ({
    productId,
    totalReviews,
    averageRating: Number((averageRating || 0).toFixed(1)),
});
