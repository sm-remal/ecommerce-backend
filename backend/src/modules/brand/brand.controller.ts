import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import type { BrandListFilters } from "./brand.interface";
import { BrandService } from "./brand.service";
import { getQueryValue, parseBrandStatus } from "./brand.validation";

const createBrand = asyncHandler(async (req: Request, res: Response) => {
    const brand = await BrandService.createBrand(req.body);

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.brand.created,
        data: brand,
    });
});

const getBrands = asyncHandler(async (req: Request, res: Response) => {
    const filters: BrandListFilters = {};
    const search = getQueryValue(req.query.search);
    const status = parseBrandStatus(req.query.status);
    const page = Number(getQueryValue(req.query.page));
    const limit = Number(getQueryValue(req.query.limit));

    if (search) {
        filters.search = search;
    }

    if (status) {
        filters.status = status;
    }

    if (Number.isFinite(page)) filters.page = page;
    if (Number.isFinite(limit)) filters.limit = limit;

    const brands = await BrandService.getBrands(filters);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.brand.listed,
        data: brands,
    });
});

const getBrandById = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const brand = await BrandService.getBrandById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.brand.found,
        data: brand,
    });
});

const getBrandBySlug = asyncHandler(async (req: Request, res: Response) => {
    const slug = getQueryValue(req.params.slug);
    if (!slug) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const brand = await BrandService.getBrandBySlug(slug);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.brand.found,
        data: brand,
    });
});

const updateBrand = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const brand = await BrandService.updateBrand(id, req.body);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.brand.updated,
        data: brand,
    });
});

const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const brand = await BrandService.deleteBrand(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.brand.deleted,
        data: brand,
    });
});

export const BrandController = {
    createBrand,
    getBrands,
    getBrandById,
    getBrandBySlug,
    updateBrand,
    deleteBrand,
};
