import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { BannerController } from "./banner.controller";
import { validateBannerPayload } from "./banner.validation";

const router = Router();

router.get("/", BannerController.getBanners);
router.get("/:id", BannerController.getBannerById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateBannerPayload(body as Parameters<typeof validateBannerPayload>[0]) }), BannerController.createBanner);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateBannerPayload(body as Parameters<typeof validateBannerPayload>[0], true) }), BannerController.updateBanner);
router.delete("/:id", authMiddleware, requireAdmin, BannerController.deleteBanner);

export const BannerRoutes = router;
