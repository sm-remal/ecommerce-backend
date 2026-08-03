import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import {
    getQueryValue,
    parseBoolean,
    parseNumber,
    parseProductStatus,
    parseSortBy,
    parseStockStatus,
} from "./product.validation";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { writeAuditLog } from "../../utility/auditLog";
import type { ProductListFilters } from "./product.interface";
import { ProductService } from "./product.service";

type AuthenticatedRequest = Request & {
    user?: {
        id: string;
        email: string;
    };
};

const createProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const product = await ProductService.createProduct(req.body, req.user?.id);
    await writeAuditLog({
        req,
        action: "CREATE",
        module: "Product",
        description: `Created product ${product.name} (${product.id})`,
    });

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.product.created,
        data: product,
    });
});

const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const filters: ProductListFilters = {};

    const search = getQueryValue(req.query.search);
    const categoryId = getQueryValue(req.query.categoryId);
    const brandId = getQueryValue(req.query.brandId);
    const tag = getQueryValue(req.query.tag);
    const status = parseProductStatus(req.query.status);
    const stockStatus = parseStockStatus(req.query.stockStatus);
    const sortBy = parseSortBy(req.query.sortBy);
    const isFeatured = parseBoolean(req.query.isFeatured);
    const isTrending = parseBoolean(req.query.isTrending);
    const isNewArrival = parseBoolean(req.query.isNewArrival);
    const minPrice = parseNumber(req.query.minPrice);
    const maxPrice = parseNumber(req.query.maxPrice);
    const page = parseNumber(req.query.page);
    const limit = parseNumber(req.query.limit);

    if (search) filters.search = search;
    if (categoryId) filters.categoryId = categoryId;
    if (brandId) filters.brandId = brandId;
    if (tag) filters.tag = tag;
    if (status) filters.status = status;
    if (stockStatus) filters.stockStatus = stockStatus;
    if (sortBy) filters.sortBy = sortBy;
    if (typeof isFeatured !== "undefined") filters.isFeatured = isFeatured;
    if (typeof isTrending !== "undefined") filters.isTrending = isTrending;
    if (typeof isNewArrival !== "undefined") filters.isNewArrival = isNewArrival;
    if (typeof minPrice !== "undefined") filters.minPrice = minPrice;
    if (typeof maxPrice !== "undefined") filters.maxPrice = maxPrice;
    if (typeof page !== "undefined") filters.page = page;
    if (typeof limit !== "undefined") filters.limit = limit;

    const products = await ProductService.getProducts(filters);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.product.listed,
        data: products,
    });
});

const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const product = await ProductService.getProductById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.product.found,
        data: product,
    });
});

const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
    const slug = getQueryValue(req.params.slug);
    if (!slug) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const product = await ProductService.getProductBySlug(slug);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.product.found,
        data: product,
    });
});

const updateProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const product = await ProductService.updateProduct(id, req.body, req.user?.id);
    await writeAuditLog({
        req,
        action: "UPDATE",
        module: "Product",
        description: `Updated product ${product.name} (${product.id})`,
    });

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.product.updated,
        data: product,
    });
});

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const product = await ProductService.deleteProduct(id);
    await writeAuditLog({
        req,
        action: "DELETE",
        module: "Product",
        description: `Deleted or archived product ${product.name} (${product.id})`,
    });

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.product.deleted,
        data: product,
    });
});

export const ProductController = {
    createProduct,
    getProducts,
    getProductById,
    getProductBySlug,
    updateProduct,
    deleteProduct,
};
