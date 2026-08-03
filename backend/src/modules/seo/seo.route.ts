import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { SeoController } from "./seo.controller";
import { validateAttachSeoPayload, validateSeoPayload } from "./seo.validation";

const router = Router();

router.get("/", SeoController.getSeoList);
router.get("/target/:targetType/:targetId", SeoController.getSeoByTarget);
router.get("/:id", SeoController.getSeoById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateSeoPayload(body as Parameters<typeof validateSeoPayload>[0]) }), SeoController.createSeo);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateSeoPayload(body as Parameters<typeof validateSeoPayload>[0]) }), SeoController.updateSeo);
router.patch("/:id/attach", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateAttachSeoPayload(body as Parameters<typeof validateAttachSeoPayload>[0]) }), SeoController.attachSeo);
router.patch("/target/:targetType/:targetId/unlink", authMiddleware, requireAdmin, SeoController.unlinkSeoFromTarget);
router.delete("/:id", authMiddleware, requireAdmin, SeoController.deleteSeo);

export const SeoRoutes = router;
