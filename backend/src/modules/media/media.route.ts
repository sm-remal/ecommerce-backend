import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { MediaController } from "./media.controller";
import { validateMediaPayload } from "./media.validation";

const router = Router();

router.get("/", MediaController.getMediaList);
router.get("/:id", MediaController.getMediaById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateMediaPayload(body as Parameters<typeof validateMediaPayload>[0]) }), MediaController.createMedia);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateMediaPayload(body as Parameters<typeof validateMediaPayload>[0], true) }), MediaController.updateMedia);
router.delete("/:id", authMiddleware, requireAdmin, MediaController.deleteMedia);

export const MediaRoutes = router;
