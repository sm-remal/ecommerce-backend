import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import type { InventoryListFilters } from "./inventory.interface";
import { InventoryService } from "./inventory.service";
import { getQueryValue, parseNumber, parseStockStatus } from "./inventory.validation";

type AuthenticatedRequest = Request & {
    user?: {
        id: string;
        email: string;
    };
};

const createInventory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const inventory = await InventoryService.createInventory(req.body, req.user?.id);

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.inventory.created,
        data: inventory,
    });
});

const getInventories = asyncHandler(async (req: Request, res: Response) => {
    const filters: InventoryListFilters = {};
    const productId = getQueryValue(req.query.productId);
    const stockStatus = parseStockStatus(req.query.stockStatus);
    const page = parseNumber(req.query.page);
    const limit = parseNumber(req.query.limit);

    if (productId) {
        filters.productId = productId;
    }

    if (stockStatus) {
        filters.stockStatus = stockStatus;
    }

    if (typeof page !== "undefined") filters.page = page;
    if (typeof limit !== "undefined") filters.limit = limit;

    const inventories = await InventoryService.getInventories(filters);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.inventory.listed,
        data: inventories,
    });
});

const getInventoryById = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const inventory = await InventoryService.getInventoryById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.inventory.found,
        data: inventory,
    });
});

const getInventoryByProductId = asyncHandler(async (req: Request, res: Response) => {
    const productId = getQueryValue(req.params.productId);
    if (!productId) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const inventory = await InventoryService.getInventoryByProductId(productId);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.inventory.found,
        data: inventory,
    });
});

const updateInventory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const inventory = await InventoryService.updateInventory(id, req.body, req.user?.id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.inventory.updated,
        data: inventory,
    });
});

const adjustInventory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const productId = getQueryValue(req.params.productId);
    if (!productId) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const inventory = await InventoryService.adjustInventory(productId, req.body, req.user?.id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.inventory.adjusted,
        data: inventory,
    });
});

const getInventoryLogs = asyncHandler(async (req: Request, res: Response) => {
    const productId = getQueryValue(req.query.productId);
    const logs = await InventoryService.getInventoryLogs(productId);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.inventory.logsListed,
        data: logs,
    });
});

const deleteInventory = asyncHandler(async (req: Request, res: Response) => {
    const id = getQueryValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const inventory = await InventoryService.deleteInventory(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.inventory.deleted,
        data: inventory,
    });
});

export const InventoryController = {
    createInventory,
    getInventories,
    getInventoryById,
    getInventoryByProductId,
    updateInventory,
    adjustInventory,
    getInventoryLogs,
    deleteInventory,
};
