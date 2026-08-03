import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { ReportController } from "./report.controller";
import { parseReportQuery } from "./report.validation";

const router = Router();

router.get("/overview", authMiddleware, requireAdmin, validateRequest({ query: parseReportQuery }), ReportController.getOverviewReport);
router.get("/sales", authMiddleware, requireAdmin, validateRequest({ query: parseReportQuery }), ReportController.getSalesReport);
router.get("/inventory", authMiddleware, requireAdmin, validateRequest({ query: parseReportQuery }), ReportController.getInventoryReport);
router.get("/products", authMiddleware, requireAdmin, validateRequest({ query: parseReportQuery }), ReportController.getProductReport);
router.get("/customers", authMiddleware, requireAdmin, validateRequest({ query: parseReportQuery }), ReportController.getCustomerReport);

export const ReportRoutes = router;
