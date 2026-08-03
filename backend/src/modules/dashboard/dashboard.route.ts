import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { DashboardController } from "./dashboard.controller";
import { parseDashboardQuery } from "./dashboard.validation";

const router = Router();

router.get("/overview", authMiddleware, requireAdmin, validateRequest({ query: parseDashboardQuery }), DashboardController.getDashboardOverview);

export const DashboardRoutes = router;
