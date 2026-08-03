import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { SettingsService } from "./settings.service";

const createSettings = asyncHandler(async (req: Request, res: Response) => {
    const settings = await SettingsService.createSettings(req.body);

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.settings.created,
        data: settings,
    });
});

const getSettings = asyncHandler(async (req: Request, res: Response) => {
    const settings = await SettingsService.getSettings();

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.settings.found,
        data: settings,
    });
});

const upsertSettings = asyncHandler(async (req: Request, res: Response) => {
    const settings = await SettingsService.upsertSettings(req.body);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.settings.saved,
        data: settings,
    });
});

const updateSettings = asyncHandler(async (req: Request, res: Response) => {
    const settings = await SettingsService.updateSettings(req.body);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.settings.updated,
        data: settings,
    });
});

const deleteSettings = asyncHandler(async (req: Request, res: Response) => {
    const settings = await SettingsService.deleteSettings();

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.settings.deleted,
        data: settings,
    });
});

export const SettingsController = {
    createSettings,
    getSettings,
    upsertSettings,
    updateSettings,
    deleteSettings,
};
