import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { ProductController } from "./product.controller";
import { validateProductPayload } from "./product.validation";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/slug/:slug", ProductController.getProductBySlug);
router.get("/:id", ProductController.getProductById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateProductPayload(body as Parameters<typeof validateProductPayload>[0]) }), ProductController.createProduct);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateProductPayload(body as Parameters<typeof validateProductPayload>[0], true) }), ProductController.updateProduct);
router.delete("/:id", authMiddleware, requireAdmin, ProductController.deleteProduct);

export const ProductRoutes = router;
