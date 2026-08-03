import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import type { ProductImageListFilters } from "./productImage.interface";
import { ProductImageService } from "./productImage.service";
import { getQueryValue, parseBoolean } from "./productImage.validation";

const createProductImage = asyncHandler(async (req: Request, res: Response) => {
    const image = await ProductImageService.createProductImage(req.body);

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.productImage.created,
        data: image,
    });
});

const getProductImages = asyncHandler(async (req: Request, res: Response) => {
    const filters: ProductImageListFilters = {};
    const productId = getQueryValue(req.query.productId);
    const isThumbnail = parseBoolean(req.query.isThumbnail);
    const page = Number(getQueryValue(req.query.page));
    const limit = Number(getQueryValue(req.query.limit));

    if (productId) {
        filters.productId = productId;
    }

    if (typeof isThumbnail !== "undefined") {
        filters.isThumbnail = isThumbnail;
    }

    if (Number.isFinite(page)) filters.page = page;
    if (Number.isFinite(limit)) filters.limit = limit;

    const images = await ProductImageService.getProductImages(filters);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.productImage.listed,
        data: images,
    });
});

const getProductImageById = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const image = await ProductImageService.getProductImageById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.productImage.found,
        data: image,
    });
});

const updateProductImage = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const image = await ProductImageService.updateProductImage(id, req.body);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.productImage.updated,
        data: image,
    });
});

const deleteProductImage = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const image = await ProductImageService.deleteProductImage(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.productImage.deleted,
        data: image,
    });
});

export const ProductImageController = {
    createProductImage,
    getProductImages,
    getProductImageById,
    updateProductImage,
    deleteProductImage,
};
