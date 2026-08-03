import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import type { AuthenticatedRequest } from "../../middleware/auth";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { NotificationService } from "./notification.service";
import { parseNotificationQuery } from "./notification.validation";

const getUserId = (req: AuthenticatedRequest) => req.user?.id;

const getNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const notifications = await NotificationService.getNotifications(parseNotificationQuery(req.query), getUserId(req));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.notification.listed,
        data: notifications,
    });
});

const getNotificationSummary = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const summary = await NotificationService.getNotificationSummary(parseNotificationQuery(req.query), getUserId(req));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.notification.summary,
        data: summary,
    });
});

const getStockNotifications = asyncHandler(async (req: Request, res: Response) => {
    const notifications = await NotificationService.getStockNotifications(parseNotificationQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.notification.stock,
        data: notifications,
    });
});

const getOrderNotifications = asyncHandler(async (req: Request, res: Response) => {
    const notifications = await NotificationService.getPendingOrderNotifications(parseNotificationQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.notification.orders,
        data: notifications,
    });
});

const getReviewNotifications = asyncHandler(async (req: Request, res: Response) => {
    const notifications = await NotificationService.getPendingReviewNotifications(parseNotificationQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.notification.reviews,
        data: notifications,
    });
});

const getPromotionNotifications = asyncHandler(async (req: Request, res: Response) => {
    const notifications = await NotificationService.getPromotionNotifications(parseNotificationQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.notification.promotions,
        data: notifications,
    });
});

const markNotificationAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : undefined;
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const notification = await NotificationService.markNotificationAsRead(id, getUserId(req));

    sendResponse(res, 200, {
        success: true,
        message: "Notification marked as read",
        data: notification,
    });
});

const markNotificationAsUnread = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : undefined;
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const notification = await NotificationService.markNotificationAsUnread(id, getUserId(req));

    sendResponse(res, 200, {
        success: true,
        message: "Notification marked as unread",
        data: notification,
    });
});

const dismissNotification = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : undefined;
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const notification = await NotificationService.dismissNotification(id, getUserId(req));

    sendResponse(res, 200, {
        success: true,
        message: "Notification dismissed",
        data: notification,
    });
});

const markAllNotificationsAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await NotificationService.markAllNotificationsAsRead(getUserId(req));

    sendResponse(res, 200, {
        success: true,
        message: "Notifications marked as read",
        data: result,
    });
});

const dismissAllNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await NotificationService.dismissAllNotifications(getUserId(req));

    sendResponse(res, 200, {
        success: true,
        message: "Notifications dismissed",
        data: result,
    });
});

export const NotificationController = {
    getNotifications,
    getNotificationSummary,
    getStockNotifications,
    getOrderNotifications,
    getReviewNotifications,
    getPromotionNotifications,
    markNotificationAsRead,
    markNotificationAsUnread,
    dismissNotification,
    markAllNotificationsAsRead,
    dismissAllNotifications,
};
