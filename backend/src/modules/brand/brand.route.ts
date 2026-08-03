import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { BrandController } from "./brand.controller";
import { validateBrandPayload } from "./brand.validation";

const router = Router();

router.get("/", BrandController.getBrands);
router.get("/slug/:slug", BrandController.getBrandBySlug);
router.get("/:id", BrandController.getBrandById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateBrandPayload(body as Parameters<typeof validateBrandPayload>[0]) }), BrandController.createBrand);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateBrandPayload(body as Parameters<typeof validateBrandPayload>[0], true) }), BrandController.updateBrand);
router.delete("/:id", authMiddleware, requireAdmin, BrandController.deleteBrand);

export const BrandRoutes = router;
