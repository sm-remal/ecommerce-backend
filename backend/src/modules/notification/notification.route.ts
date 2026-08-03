import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { NotificationController } from "./notification.controller";
import { parseNotificationQuery } from "./notification.validation";

const router = Router();

router.get("/", authMiddleware, requireAdmin, validateRequest({ query: parseNotificationQuery }), NotificationController.getNotifications);
router.get("/summary", authMiddleware, requireAdmin, validateRequest({ query: parseNotificationQuery }), NotificationController.getNotificationSummary);
router.get("/stock", authMiddleware, requireAdmin, validateRequest({ query: parseNotificationQuery }), NotificationController.getStockNotifications);
router.get("/orders", authMiddleware, requireAdmin, validateRequest({ query: parseNotificationQuery }), NotificationController.getOrderNotifications);
router.get("/reviews", authMiddleware, requireAdmin, validateRequest({ query: parseNotificationQuery }), NotificationController.getReviewNotifications);
router.get("/promotions", authMiddleware, requireAdmin, validateRequest({ query: parseNotificationQuery }), NotificationController.getPromotionNotifications);
router.patch("/read-all", authMiddleware, requireAdmin, NotificationController.markAllNotificationsAsRead);
router.patch("/dismiss-all", authMiddleware, requireAdmin, NotificationController.dismissAllNotifications);
router.patch("/:id/read", authMiddleware, requireAdmin, NotificationController.markNotificationAsRead);
router.patch("/:id/unread", authMiddleware, requireAdmin, NotificationController.markNotificationAsUnread);
router.patch("/:id/dismiss", authMiddleware, requireAdmin, NotificationController.dismissNotification);

export const NotificationRoutes = router;
