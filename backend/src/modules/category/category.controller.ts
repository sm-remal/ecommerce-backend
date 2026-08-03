import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { CategoryService } from "./category.service";
import { AppError } from "../../utility/AppError";
import sendResponse from "../../utility/sendResponse";
import { writeAuditLog } from "../../utility/auditLog";
import { responseMessages } from "../../utility/responseMessages";
import type { CategoryListFilters } from "./category.interface";

const getQueryValue = (value: unknown) => {
    if (Array.isArray(value)) {
        const firstValue = value[0];
        return typeof firstValue === "string" ? firstValue : undefined;
    }

    return typeof value === "string" ? value : undefined;
};

const parseStatus = (value: unknown) => {
    const status = getQueryValue(value)?.toUpperCase();
    if (status === "ACTIVE" || status === "DRAFT" || status === "HIDDEN") {
        return status;
    }

    return undefined;
};

const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await CategoryService.createCategory(req.body);
    await writeAuditLog({
        req,
        action: "CREATE",
        module: "Category",
        description: `Created category ${category.name} (${category.id})`,
    });

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.category.created,
        data: category,
    });
});

const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const { search, status, parentId, flat } = req.query;
    const filters: CategoryListFilters = {};

    const searchValue = getQueryValue(search);
    const statusValue = parseStatus(status);
    const parentIdValue = getQueryValue(parentId);
    const page = Number(getQueryValue(req.query.page));
    const limit = Number(getQueryValue(req.query.limit));

    if (searchValue) {
        filters.search = searchValue;
    }

    if (statusValue) {
        filters.status = statusValue;
    }

    if (parentIdValue) {
        filters.parentId = parentIdValue;
    }

    if (typeof flat === "string") {
        filters.flat = flat === "true";
    }

    if (Number.isFinite(page)) {
        filters.page = page;
    }

    if (Number.isFinite(limit)) {
        filters.limit = limit;
    }

    const categories = await CategoryService.getCategories(filters);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.category.listed,
        data: categories,
    });
});

const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const category = await CategoryService.getCategoryById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.category.found,
        data: category,
    });
});

const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
    const slug = getQueryValue(req.params.slug);
    if (!slug) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const category = await CategoryService.getCategoryBySlug(slug);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.category.found,
        data: category,
    });
});

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const category = await CategoryService.updateCategory(id, req.body);
    await writeAuditLog({
        req,
        action: "UPDATE",
        module: "Category",
        description: `Updated category ${category.name} (${category.id})`,
    });

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.category.updated,
        data: category,
    });
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const category = await CategoryService.deleteCategory(id);
    await writeAuditLog({
        req,
        action: "DELETE",
        module: "Category",
        description: `Deleted category ${category.name} (${category.id})`,
    });

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.category.deleted,
        data: category,
    });
});

export const CategoryController = {
    createCategory,
    getCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
};
