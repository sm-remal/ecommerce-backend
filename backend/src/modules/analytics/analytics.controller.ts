import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { AnalyticsService } from "./analytics.service";
import { parseAnalyticsQuery } from "./analytics.validation";

const getOverviewAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await AnalyticsService.getOverviewAnalytics(parseAnalyticsQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.analytics.overview,
        data: analytics,
    });
});

const getSalesAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await AnalyticsService.getSalesAnalytics(parseAnalyticsQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.analytics.sales,
        data: analytics,
    });
});

const getProductAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await AnalyticsService.getProductAnalytics(parseAnalyticsQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.analytics.products,
        data: analytics,
    });
});

const getCustomerAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await AnalyticsService.getCustomerAnalytics(parseAnalyticsQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.analytics.customers,
        data: analytics,
    });
});

const getTrafficAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await AnalyticsService.getTrafficAnalytics(parseAnalyticsQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.analytics.traffic,
        data: analytics,
    });
});

export const AnalyticsController = {
    getOverviewAnalytics,
    getSalesAnalytics,
    getProductAnalytics,
    getCustomerAnalytics,
    getTrafficAnalytics,
};
