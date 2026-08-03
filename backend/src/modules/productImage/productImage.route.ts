import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { ProductImageController } from "./productImage.controller";
import { validateProductImagePayload } from "./productImage.validation";

const router = Router();

router.get("/", ProductImageController.getProductImages);
router.get("/:id", ProductImageController.getProductImageById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateProductImagePayload(body as Parameters<typeof validateProductImagePayload>[0]) }), ProductImageController.createProductImage);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateProductImagePayload(body as Parameters<typeof validateProductImagePayload>[0], true) }), ProductImageController.updateProductImage);
router.delete("/:id", authMiddleware, requireAdmin, ProductImageController.deleteProductImage);

export const ProductImageRoutes = router;
