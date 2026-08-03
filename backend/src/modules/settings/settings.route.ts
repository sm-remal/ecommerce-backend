import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { SettingsController } from "./settings.controller";
import { validateCreateSettingsPayload, validateUpdateSettingsPayload } from "./settings.validation";

const router = Router();

router.get("/", SettingsController.getSettings);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateCreateSettingsPayload(body as Parameters<typeof validateCreateSettingsPayload>[0]) }), SettingsController.createSettings);
router.put("/", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateCreateSettingsPayload(body as Parameters<typeof validateCreateSettingsPayload>[0]) }), SettingsController.upsertSettings);
router.patch("/", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateUpdateSettingsPayload(body as Parameters<typeof validateUpdateSettingsPayload>[0]) }), SettingsController.updateSettings);
router.delete("/", authMiddleware, requireAdmin, SettingsController.deleteSettings);

export const SettingsRoutes = router;
