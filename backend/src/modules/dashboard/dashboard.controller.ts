import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { DashboardService } from "./dashboard.service";
import { parseDashboardQuery } from "./dashboard.validation";

const getDashboardOverview = asyncHandler(async (req: Request, res: Response) => {
    const dashboard = await DashboardService.getDashboardOverview(parseDashboardQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.dashboard.overview,
        data: dashboard,
    });
});

export const DashboardController = {
    getDashboardOverview,
};
