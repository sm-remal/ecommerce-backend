import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { ActivityLogService } from "./activityLog.service";
import {
    parseActivityLogFilters,
    parseCreateActivityLogPayload,
} from "./activityLog.validation";

type AuthenticatedRequest = Request & {
    user?: {
        id: string;
        email: string;
    };
};

const getParamValue = (value: unknown) => typeof value === "string" ? value : undefined;

const createActivityLog = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const payload = parseCreateActivityLogPayload({
        ...req.body,
        adminId: req.body?.adminId ?? req.user?.id,
        ipAddress: req.body?.ipAddress ?? req.ip,
    });
    const log = await ActivityLogService.createActivityLog(payload);

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.activityLog.created,
        data: log,
    });
});

const getActivityLogs = asyncHandler(async (req: Request, res: Response) => {
    const logs = await ActivityLogService.getActivityLogs(parseActivityLogFilters(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.activityLog.listed,
        data: logs,
    });
});

const getActivityLogById = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const log = await ActivityLogService.getActivityLogById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.activityLog.found,
        data: log,
    });
});

const deleteActivityLog = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const log = await ActivityLogService.deleteActivityLog(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.activityLog.deleted,
        data: log,
    });
});

export const ActivityLogController = {
    createActivityLog,
    getActivityLogs,
    getActivityLogById,
    deleteActivityLog,
};
