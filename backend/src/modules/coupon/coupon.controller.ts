import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { CouponService } from "./coupon.service";
import {
    parseCouponListFilters,
    parseCreateCouponPayload,
    parseUpdateCouponPayload,
    parseValidateCouponPayload,
} from "./coupon.validation";

const getParamValue = (value: unknown) => typeof value === "string" ? value : undefined;

const createCoupon = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await CouponService.createCoupon(parseCreateCouponPayload(req.body));

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.coupon.created,
        data: coupon,
    });
});

const getCoupons = asyncHandler(async (req: Request, res: Response) => {
    const coupons = await CouponService.getCoupons(parseCouponListFilters(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.coupon.listed,
        data: coupons,
    });
});

const getCouponById = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const coupon = await CouponService.getCouponById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.coupon.found,
        data: coupon,
    });
});

const getCouponByCode = asyncHandler(async (req: Request, res: Response) => {
    const code = getParamValue(req.params.code);
    if (!code) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const coupon = await CouponService.getCouponByCode(code);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.coupon.found,
        data: coupon,
    });
});

const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await CouponService.validateCoupon(parseValidateCouponPayload(req.body));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.coupon.validated,
        data: coupon,
    });
});

const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const coupon = await CouponService.updateCoupon(id, parseUpdateCouponPayload(req.body));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.coupon.updated,
        data: coupon,
    });
});

const useCoupon = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const coupon = await CouponService.useCoupon(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.coupon.used,
        data: coupon,
    });
});

const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const coupon = await CouponService.deleteCoupon(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.coupon.deleted,
        data: coupon,
    });
});

export const CouponController = {
    createCoupon,
    getCoupons,
    getCouponById,
    getCouponByCode,
    validateCoupon,
    updateCoupon,
    useCoupon,
    deleteCoupon,
};
