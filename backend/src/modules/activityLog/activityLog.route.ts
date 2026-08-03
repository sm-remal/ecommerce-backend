import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { ActivityLogController } from "./activityLog.controller";
import { parseActivityLogFilters, parseCreateActivityLogPayload } from "./activityLog.validation";

const router = Router();

router.get("/", authMiddleware, requireAdmin, validateRequest({ query: parseActivityLogFilters }), ActivityLogController.getActivityLogs);
router.get("/:id", authMiddleware, requireAdmin, ActivityLogController.getActivityLogById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: parseCreateActivityLogPayload }), ActivityLogController.createActivityLog);
router.delete("/:id", authMiddleware, requireAdmin, ActivityLogController.deleteActivityLog);

export const ActivityLogRoutes = router;
