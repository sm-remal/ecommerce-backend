import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { ReviewService } from "./review.service";
import {
    parseCreateReviewPayload,
    parseReviewListFilters,
    parseUpdateReviewPayload,
    parseUpdateReviewStatusPayload,
} from "./review.validation";

const getParamValue = (value: unknown) => typeof value === "string" ? value : undefined;

const createReview = asyncHandler(async (req: Request, res: Response) => {
    const review = await ReviewService.createReview(parseCreateReviewPayload(req.body));

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.review.created,
        data: review,
    });
});

const getReviews = asyncHandler(async (req: Request, res: Response) => {
    const reviews = await ReviewService.getReviews(parseReviewListFilters(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.review.listed,
        data: reviews,
    });
});

const getReviewById = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const review = await ReviewService.getReviewById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.review.found,
        data: review,
    });
});

const getReviewStatsByProduct = asyncHandler(async (req: Request, res: Response) => {
    const productId = getParamValue(req.params.productId);
    if (!productId) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const stats = await ReviewService.getReviewStatsByProduct(productId);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.review.stats,
        data: stats,
    });
});

const updateReview = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const review = await ReviewService.updateReview(id, parseUpdateReviewPayload(req.body));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.review.updated,
        data: review,
    });
});

const updateReviewStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const review = await ReviewService.updateReviewStatus(id, parseUpdateReviewStatusPayload(req.body));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.review.statusUpdated,
        data: review,
    });
});

const deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const review = await ReviewService.deleteReview(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.review.deleted,
        data: review,
    });
});

export const ReviewController = {
    createReview,
    getReviews,
    getReviewById,
    getReviewStatsByProduct,
    updateReview,
    updateReviewStatus,
    deleteReview,
};
