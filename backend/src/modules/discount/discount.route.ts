import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { DiscountController } from "./discount.controller";
import { validateDiscountPayload, validateSyncDiscountTargetsPayload } from "./discount.validation";

const router = Router();

router.get("/", DiscountController.getDiscounts);
router.get("/:id", DiscountController.getDiscountById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateDiscountPayload(body as Parameters<typeof validateDiscountPayload>[0]) }), DiscountController.createDiscount);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateDiscountPayload(body as Parameters<typeof validateDiscountPayload>[0], true) }), DiscountController.updateDiscount);
router.patch("/:id/targets", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateSyncDiscountTargetsPayload(body as Parameters<typeof validateSyncDiscountTargetsPayload>[0]) }), DiscountController.syncDiscountTargets);
router.delete("/:id", authMiddleware, requireAdmin, DiscountController.deleteDiscount);

export const DiscountRoutes = router;
