import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { AnalyticsController } from "./analytics.controller";
import { parseAnalyticsQuery } from "./analytics.validation";

const router = Router();

router.get("/overview", authMiddleware, requireAdmin, validateRequest({ query: parseAnalyticsQuery }), AnalyticsController.getOverviewAnalytics);
router.get("/sales", authMiddleware, requireAdmin, validateRequest({ query: parseAnalyticsQuery }), AnalyticsController.getSalesAnalytics);
router.get("/products", authMiddleware, requireAdmin, validateRequest({ query: parseAnalyticsQuery }), AnalyticsController.getProductAnalytics);
router.get("/customers", authMiddleware, requireAdmin, validateRequest({ query: parseAnalyticsQuery }), AnalyticsController.getCustomerAnalytics);
router.get("/traffic", authMiddleware, requireAdmin, validateRequest({ query: parseAnalyticsQuery }), AnalyticsController.getTrafficAnalytics);

export const AnalyticsRoutes = router;
