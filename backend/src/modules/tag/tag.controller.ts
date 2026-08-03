import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import type { TagListFilters } from "./tag.interface";
import { TagService } from "./tag.service";
import { getQueryValue } from "./tag.validation";

const createTag = asyncHandler(async (req: Request, res: Response) => {
    const tag = await TagService.createTag(req.body);

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.tag.created,
        data: tag,
    });
});

const getTags = asyncHandler(async (req: Request, res: Response) => {
    const filters: TagListFilters = {};
    const search = getQueryValue(req.query.search);
    const page = Number(getQueryValue(req.query.page));
    const limit = Number(getQueryValue(req.query.limit));

    if (search) {
        filters.search = search;
    }

    if (Number.isFinite(page)) filters.page = page;
    if (Number.isFinite(limit)) filters.limit = limit;

    const tags = await TagService.getTags(filters);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.tag.listed,
        data: tags,
    });
});

const getTagById = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const tag = await TagService.getTagById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.tag.found,
        data: tag,
    });
});

const getTagBySlug = asyncHandler(async (req: Request, res: Response) => {
    const slug = getQueryValue(req.params.slug);
    if (!slug) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const tag = await TagService.getTagBySlug(slug);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.tag.found,
        data: tag,
    });
});

const updateTag = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const tag = await TagService.updateTag(id, req.body);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.tag.updated,
        data: tag,
    });
});

const deleteTag = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const tag = await TagService.deleteTag(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.tag.deleted,
        data: tag,
    });
});

export const TagController = {
    createTag,
    getTags,
    getTagById,
    getTagBySlug,
    updateTag,
    deleteTag,
};
