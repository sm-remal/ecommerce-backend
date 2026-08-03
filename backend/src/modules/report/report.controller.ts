import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { ReportService } from "./report.service";
import { parseReportQuery } from "./report.validation";

const getOverviewReport = asyncHandler(async (req: Request, res: Response) => {
    const report = await ReportService.getOverviewReport(parseReportQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.report.overview,
        data: report,
    });
});

const getSalesReport = asyncHandler(async (req: Request, res: Response) => {
    const report = await ReportService.getSalesReport(parseReportQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.report.sales,
        data: report,
    });
});

const getInventoryReport = asyncHandler(async (req: Request, res: Response) => {
    const report = await ReportService.getInventoryReport(parseReportQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.report.inventory,
        data: report,
    });
});

const getProductReport = asyncHandler(async (req: Request, res: Response) => {
    const report = await ReportService.getProductReport(parseReportQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.report.products,
        data: report,
    });
});

const getCustomerReport = asyncHandler(async (req: Request, res: Response) => {
    const report = await ReportService.getCustomerReport(parseReportQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.report.customers,
        data: report,
    });
});

export const ReportController = {
    getOverviewReport,
    getSalesReport,
    getInventoryReport,
    getProductReport,
    getCustomerReport,
};
