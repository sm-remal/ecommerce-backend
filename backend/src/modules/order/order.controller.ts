import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { writeAuditLog } from "../../utility/auditLog";
import { OrderService } from "./order.service";
import {
    parseCreateOrderPayload,
    parseOrderListFilters,
    parseUpdateOrderPayload,
    parseUpdateOrderStatusPayload,
} from "./order.validation";

const getParamValue = (value: unknown) => typeof value === "string" ? value : undefined;

const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderService.createOrder(parseCreateOrderPayload(req.body));
    await writeAuditLog({
        req,
        action: "CREATE",
        module: "OrderRequest",
        description: `Created order inquiry ${order.orderNumber} (${order.id})`,
    });

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.order.created,
        data: order,
    });
});

const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderService.getOrders(parseOrderListFilters(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.order.listed,
        data: orders,
    });
});

const getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const order = await OrderService.getOrderById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.order.found,
        data: order,
    });
});

const getOrderByNumber = asyncHandler(async (req: Request, res: Response) => {
    const orderNumber = getParamValue(req.params.orderNumber);
    if (!orderNumber) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const order = await OrderService.getOrderByNumber(orderNumber);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.order.found,
        data: order,
    });
});

const updateOrder = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const order = await OrderService.updateOrder(id, parseUpdateOrderPayload(req.body));
    await writeAuditLog({
        req,
        action: "UPDATE",
        module: "OrderRequest",
        description: `Updated order inquiry ${order.orderNumber} (${order.id})`,
    });

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.order.updated,
        data: order,
    });
});

const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const order = await OrderService.updateOrderStatus(id, parseUpdateOrderStatusPayload(req.body));
    await writeAuditLog({
        req,
        action: "UPDATE",
        module: "OrderRequest",
        description: `Updated order inquiry status ${order.orderNumber} (${order.status})`,
    });

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.order.statusUpdated,
        data: order,
    });
});

const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const order = await OrderService.deleteOrder(id);
    await writeAuditLog({
        req,
        action: "DELETE",
        module: "OrderRequest",
        description: `Deleted order inquiry ${order.orderNumber} (${order.id})`,
    });

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.order.deleted,
        data: order,
    });
});

export const OrderController = {
    createOrder,
    getOrders,
    getOrderById,
    getOrderByNumber,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
};
