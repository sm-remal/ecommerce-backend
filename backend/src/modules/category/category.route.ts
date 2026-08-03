import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { CategoryController } from "./category.controller";
import { createCategorySchema, updateCategorySchema } from "./category.validation";

const router = Router();

router.get("/", CategoryController.getCategories);
router.get("/slug/:slug", CategoryController.getCategoryBySlug);
router.get("/:id", CategoryController.getCategoryById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: createCategorySchema }), CategoryController.createCategory);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: updateCategorySchema }), CategoryController.updateCategory);
router.delete("/:id", authMiddleware, requireAdmin, CategoryController.deleteCategory);

export const CategoryRoutes = router;
