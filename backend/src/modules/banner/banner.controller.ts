import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import type { BannerListFilters } from "./banner.interface";
import { BannerService } from "./banner.service";
import { getQueryValue, parseBannerPosition, parseBoolean } from "./banner.validation";

const createBanner = asyncHandler(async (req: Request, res: Response) => {
    const banner = await BannerService.createBanner(req.body);

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.banner.created,
        data: banner,
    });
});

const getBanners = asyncHandler(async (req: Request, res: Response) => {
    const filters: BannerListFilters = {};
    const search = getQueryValue(req.query.search);
    const position = parseBannerPosition(req.query.position);
    const isActive = parseBoolean(req.query.isActive);
    const activeNow = parseBoolean(req.query.activeNow);
    const page = Number(getQueryValue(req.query.page));
    const limit = Number(getQueryValue(req.query.limit));

    if (search) filters.search = search;
    if (position) filters.position = position;
    if (typeof isActive !== "undefined") filters.isActive = isActive;
    if (typeof activeNow !== "undefined") filters.activeNow = activeNow;
    if (Number.isFinite(page)) filters.page = page;
    if (Number.isFinite(limit)) filters.limit = limit;

    const banners = await BannerService.getBanners(filters);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.banner.listed,
        data: banners,
    });
});

const getBannerById = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const banner = await BannerService.getBannerById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.banner.found,
        data: banner,
    });
});

const updateBanner = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const banner = await BannerService.updateBanner(id, req.body);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.banner.updated,
        data: banner,
    });
});

const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const banner = await BannerService.deleteBanner(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.banner.deleted,
        data: banner,
    });
});

export const BannerController = {
    createBanner,
    getBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
};
