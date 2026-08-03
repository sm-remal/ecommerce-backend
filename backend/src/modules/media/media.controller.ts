import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import type { MediaListFilters } from "./media.interface";
import { MediaService } from "./media.service";
import { getQueryValue, parseMediaType } from "./media.validation";

type AuthenticatedRequest = Request & {
    user?: {
        id: string;
        email: string;
    };
};

const createMedia = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const media = await MediaService.createMedia(req.body, req.user?.id);

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.media.created,
        data: media,
    });
});

const getMediaList = asyncHandler(async (req: Request, res: Response) => {
    const filters: MediaListFilters = {};
    const search = getQueryValue(req.query.search);
    const type = parseMediaType(req.query.type);
    const uploadedById = getQueryValue(req.query.uploadedById);
    const page = Number(getQueryValue(req.query.page));
    const limit = Number(getQueryValue(req.query.limit));

    if (search) filters.search = search;
    if (type) filters.type = type;
    if (uploadedById) filters.uploadedById = uploadedById;
    if (Number.isFinite(page)) filters.page = page;
    if (Number.isFinite(limit)) filters.limit = limit;

    const media = await MediaService.getMediaList(filters);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.media.listed,
        data: media,
    });
});

const getMediaById = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const media = await MediaService.getMediaById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.media.found,
        data: media,
    });
});

const updateMedia = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const media = await MediaService.updateMedia(id, req.body);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.media.updated,
        data: media,
    });
});

const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const media = await MediaService.deleteMedia(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.media.deleted,
        data: media,
    });
});

export const MediaController = {
    createMedia,
    getMediaList,
    getMediaById,
    updateMedia,
    deleteMedia,
};
