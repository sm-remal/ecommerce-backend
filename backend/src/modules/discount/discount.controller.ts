import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import {
    getQueryValue,
    parseBoolean,
    parseDiscountType,
} from "./discount.validation";
import type { DiscountListFilters } from "./discount.interface";
import { DiscountService } from "./discount.service";

const createDiscount = asyncHandler(async (req: Request, res: Response) => {
    const discount = await DiscountService.createDiscount(req.body);

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.discount.created,
        data: discount,
    });
});

const getDiscounts = asyncHandler(async (req: Request, res: Response) => {
    const filters: DiscountListFilters = {};
    const search = getQueryValue(req.query.search);
    const type = parseDiscountType(req.query.type);
    const status = parseBoolean(req.query.status);
    const activeNow = parseBoolean(req.query.activeNow);
    const productId = getQueryValue(req.query.productId);
    const categoryId = getQueryValue(req.query.categoryId);
    const page = Number(getQueryValue(req.query.page));
    const limit = Number(getQueryValue(req.query.limit));

    if (search) filters.search = search;
    if (type) filters.type = type;
    if (typeof status !== "undefined") filters.status = status;
    if (typeof activeNow !== "undefined") filters.activeNow = activeNow;
    if (productId) filters.productId = productId;
    if (categoryId) filters.categoryId = categoryId;
    if (Number.isFinite(page)) filters.page = page;
    if (Number.isFinite(limit)) filters.limit = limit;

    const discounts = await DiscountService.getDiscounts(filters);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.discount.listed,
        data: discounts,
    });
});

const getDiscountById = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const discount = await DiscountService.getDiscountById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.discount.found,
        data: discount,
    });
});

const updateDiscount = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const discount = await DiscountService.updateDiscount(id, req.body);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.discount.updated,
        data: discount,
    });
});

const syncDiscountTargets = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const discount = await DiscountService.syncDiscountTargets(id, req.body);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.discount.synced,
        data: discount,
    });
});

const deleteDiscount = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const discount = await DiscountService.deleteDiscount(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.discount.deleted,
        data: discount,
    });
});

export const DiscountController = {
    createDiscount,
    getDiscounts,
    getDiscountById,
    updateDiscount,
    syncDiscountTargets,
    deleteDiscount,
};
