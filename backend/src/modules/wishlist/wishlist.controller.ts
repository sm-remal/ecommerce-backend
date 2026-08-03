import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { WishlistService } from "./wishlist.service";
import { parseCreateWishlistPayload, parseWishlistListFilters } from "./wishlist.validation";

type AuthenticatedRequest = Request & {
    user?: {
        id: string;
        email: string;
    };
};

const requireUserId = (req: AuthenticatedRequest) => {
    if (!req.user?.id) {
        throw new AppError(401, responseMessages.common.unauthorized);
    }

    return req.user.id;
};

const getParamValue = (value: unknown) => typeof value === "string" ? value : undefined;

const addToWishlist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const wishlist = await WishlistService.addToWishlist(
        requireUserId(req),
        parseCreateWishlistPayload(req.body),
    );

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.wishlist.created,
        data: wishlist,
    });
});

const getMyWishlist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const wishlist = await WishlistService.getWishlist(
        requireUserId(req),
        parseWishlistListFilters(req.query),
    );

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.wishlist.listed,
        data: wishlist,
    });
});

const getWishlistItemById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const wishlist = await WishlistService.getWishlistItemById(requireUserId(req), id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.wishlist.found,
        data: wishlist,
    });
});

const removeWishlistItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const wishlist = await WishlistService.removeWishlistItem(requireUserId(req), id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.wishlist.deleted,
        data: wishlist,
    });
});

const removeWishlistByProductId = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const productId = getParamValue(req.params.productId);
    if (!productId) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const wishlist = await WishlistService.removeWishlistByProductId(requireUserId(req), productId);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.wishlist.deleted,
        data: wishlist,
    });
});

const clearWishlist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const wishlist = await WishlistService.clearWishlist(requireUserId(req));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.wishlist.cleared,
        data: wishlist,
    });
});

export const WishlistController = {
    addToWishlist,
    getMyWishlist,
    getWishlistItemById,
    removeWishlistItem,
    removeWishlistByProductId,
    clearWishlist,
};
