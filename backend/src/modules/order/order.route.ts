import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { OrderController } from "./order.controller";
import {
    parseCreateOrderPayload,
    parseOrderListFilters,
    parseUpdateOrderPayload,
    parseUpdateOrderStatusPayload,
} from "./order.validation";

const router = Router();

router.get("/", authMiddleware, requireAdmin, validateRequest({ query: parseOrderListFilters }), OrderController.getOrders);
router.get("/number/:orderNumber", OrderController.getOrderByNumber);
router.get("/:id", authMiddleware, requireAdmin, OrderController.getOrderById);
router.post("/", validateRequest({ body: parseCreateOrderPayload }), OrderController.createOrder);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: parseUpdateOrderPayload }), OrderController.updateOrder);
router.patch("/:id/status", authMiddleware, requireAdmin, validateRequest({ body: parseUpdateOrderStatusPayload }), OrderController.updateOrderStatus);
router.delete("/:id", authMiddleware, requireAdmin, OrderController.deleteOrder);

export const OrderRoutes = router;
