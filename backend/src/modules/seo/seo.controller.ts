import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import type { SeoListFilters } from "./seo.interface";
import { SeoService } from "./seo.service";
import { getQueryValue, parseSeoTargetType } from "./seo.validation";

const createSeo = asyncHandler(async (req: Request, res: Response) => {
    const seo = await SeoService.createSeo(req.body);

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.seo.created,
        data: seo,
    });
});

const getSeoList = asyncHandler(async (req: Request, res: Response) => {
    const filters: SeoListFilters = {};
    const search = getQueryValue(req.query.search);
    const page = Number(getQueryValue(req.query.page));
    const limit = Number(getQueryValue(req.query.limit));

    if (search) {
        filters.search = search;
    }

    if (Number.isFinite(page)) filters.page = page;
    if (Number.isFinite(limit)) filters.limit = limit;

    const seoList = await SeoService.getSeoList(filters);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.seo.listed,
        data: seoList,
    });
});

const getSeoById = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const seo = await SeoService.getSeoById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.seo.found,
        data: seo,
    });
});

const updateSeo = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const seo = await SeoService.updateSeo(id, req.body);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.seo.updated,
        data: seo,
    });
});

const attachSeo = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const seo = await SeoService.attachSeo(id, req.body);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.seo.attached,
        data: seo,
    });
});

const getSeoByTarget = asyncHandler(async (req: Request, res: Response) => {
    const targetType = parseSeoTargetType(req.params.targetType);
    const targetId = getQueryValue(req.params.targetId);

    if (!targetType || !targetId) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const seo = await SeoService.getSeoByTarget(targetType, targetId);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.seo.found,
        data: seo,
    });
});

const unlinkSeoFromTarget = asyncHandler(async (req: Request, res: Response) => {
    const targetType = parseSeoTargetType(req.params.targetType);
    const targetId = getQueryValue(req.params.targetId);

    if (!targetType || !targetId) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const result = await SeoService.unlinkSeoFromTarget(targetType, targetId);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.seo.unlinked,
        data: result,
    });
});

const deleteSeo = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const seo = await SeoService.deleteSeo(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.seo.deleted,
        data: seo,
    });
});

export const SeoController = {
    createSeo,
    getSeoList,
    getSeoById,
    updateSeo,
    attachSeo,
    getSeoByTarget,
    unlinkSeoFromTarget,
    deleteSeo,
};
