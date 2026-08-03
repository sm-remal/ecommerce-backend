import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { CouponController } from "./coupon.controller";
import {
    couponListQuerySchema,
    createCouponSchema,
    updateCouponSchema,
    validateCouponSchema,
} from "./coupon.validation";

const router = Router();

router.get("/", validateRequest({ query: couponListQuerySchema }), CouponController.getCoupons);
router.get("/code/:code", CouponController.getCouponByCode);
router.get("/:id", CouponController.getCouponById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: createCouponSchema }), CouponController.createCoupon);
router.post("/validate", validateRequest({ body: validateCouponSchema }), CouponController.validateCoupon);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: updateCouponSchema }), CouponController.updateCoupon);
router.patch("/:id/use", authMiddleware, requireAdmin, CouponController.useCoupon);
router.delete("/:id", authMiddleware, requireAdmin, CouponController.deleteCoupon);

export const CouponRoutes = router;
