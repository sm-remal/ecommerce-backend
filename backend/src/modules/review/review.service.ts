import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import { responseMessages } from "../../utility/responseMessages";
import type {
    CreateReviewPayload,
    ReviewListFilters,
    UpdateReviewPayload,
    UpdateReviewStatusPayload,
} from "./review.interface";
import {
    buildCreateReviewData,
    buildReviewWhereClause,
    buildUpdateReviewData,
    mapReview,
    mapReviewStats,
    reviewInclude,
} from "./review.validation";

const ensureReviewProductExists = async (productId: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { id: true },
        });

        if (!product) {
            throw new AppError(404, "Product not found");
        }
    } catch (error) {
        throw error;
    }
};

const createReview = async (payload: CreateReviewPayload) => {
    try {
        await ensureReviewProductExists(payload.productId);

        const review = await prisma.review.create({
            data: buildCreateReviewData(payload),
            include: reviewInclude,
        });

        return mapReview(review);
    } catch (error) {
        throw error;
    }
};

const getReviews = async (filters: ReviewListFilters = {}) => {
    try {
        const where = buildReviewWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);
        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                orderBy: [
                    { createdAt: "desc" },
                ],
                skip,
                take: limit,
                include: reviewInclude,
            }),
            prisma.review.count({ where }),
        ]);

        return {
            items: reviews.map((review) => mapReview(review)),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getReviewById = async (id: string) => {
    try {
        const review = await prisma.review.findUnique({
            where: { id },
            include: reviewInclude,
        });

        if (!review) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapReview(review);
    } catch (error) {
        throw error;
    }
};

const getReviewStatsByProduct = async (productId: string) => {
    try {
        await ensureReviewProductExists(productId);

        const stats = await prisma.review.aggregate({
            where: {
                productId,
                status: true,
            },
            _avg: {
                rating: true,
            },
            _count: {
                id: true,
            },
        });

        return mapReviewStats(productId, stats._count.id, stats._avg.rating);
    } catch (error) {
        throw error;
    }
};

const updateReview = async (id: string, payload: UpdateReviewPayload) => {
    try {
        await getReviewById(id);

        if (payload.productId) {
            await ensureReviewProductExists(payload.productId);
        }

        const review = await prisma.review.update({
            where: { id },
            data: buildUpdateReviewData(payload),
            include: reviewInclude,
        });

        return mapReview(review);
    } catch (error) {
        throw error;
    }
};

const updateReviewStatus = async (id: string, payload: UpdateReviewStatusPayload) => {
    try {
        await getReviewById(id);

        const review = await prisma.review.update({
            where: { id },
            data: {
                status: payload.status,
            },
            include: reviewInclude,
        });

        return mapReview(review);
    } catch (error) {
        throw error;
    }
};

const deleteReview = async (id: string) => {
    try {
        await getReviewById(id);

        const deletedReview = await prisma.review.delete({
            where: { id },
        });

        return {
            id: deletedReview.id,
            productId: deletedReview.productId,
        };
    } catch (error) {
        throw error;
    }
};

export const ReviewService = {
    createReview,
    getReviews,
    getReviewById,
    getReviewStatsByProduct,
    updateReview,
    updateReviewStatus,
    deleteReview,
};
