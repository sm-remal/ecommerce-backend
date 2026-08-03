import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { InventoryController } from "./inventory.controller";
import { validateAdjustInventoryPayload, validateInventoryPayload } from "./inventory.validation";

const router = Router();

router.get("/", authMiddleware, requireAdmin, InventoryController.getInventories);
router.get("/logs", authMiddleware, requireAdmin, InventoryController.getInventoryLogs);
router.get("/product/:productId", InventoryController.getInventoryByProductId);
router.get("/:id", authMiddleware, requireAdmin, InventoryController.getInventoryById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateInventoryPayload(body as Parameters<typeof validateInventoryPayload>[0]) }), InventoryController.createInventory);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateInventoryPayload(body as Parameters<typeof validateInventoryPayload>[0], true) }), InventoryController.updateInventory);
router.patch("/product/:productId/adjust", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateAdjustInventoryPayload(body as Parameters<typeof validateAdjustInventoryPayload>[0]) }), InventoryController.adjustInventory);
router.delete("/:id", authMiddleware, requireAdmin, InventoryController.deleteInventory);

export const InventoryRoutes = router;
