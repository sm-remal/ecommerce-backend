import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { TagController } from "./tag.controller";
import { validateTagPayload } from "./tag.validation";

const router = Router();

router.get("/", TagController.getTags);
router.get("/slug/:slug", TagController.getTagBySlug);
router.get("/:id", TagController.getTagById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateTagPayload(body as Parameters<typeof validateTagPayload>[0]) }), TagController.createTag);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateTagPayload(body as Parameters<typeof validateTagPayload>[0], true) }), TagController.updateTag);
router.delete("/:id", authMiddleware, requireAdmin, TagController.deleteTag);

export const TagRoutes = router;
