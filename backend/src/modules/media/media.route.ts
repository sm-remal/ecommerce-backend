import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { MediaController } from "./media.controller";
import { validateMediaPayload, validateUploadMediaPayload } from "./media.validation";

const router = Router();

router.get("/", authMiddleware, requireAdmin, MediaController.getMediaList);
router.post("/upload", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateUploadMediaPayload(body as Parameters<typeof validateUploadMediaPayload>[0]) }), MediaController.uploadMedia);
router.get("/:id", authMiddleware, requireAdmin, MediaController.getMediaById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateMediaPayload(body as Parameters<typeof validateMediaPayload>[0]) }), MediaController.createMedia);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: (body) => validateMediaPayload(body as Parameters<typeof validateMediaPayload>[0], true) }), MediaController.updateMedia);
router.delete("/:id", authMiddleware, requireAdmin, MediaController.deleteMedia);

export const MediaRoutes = router;
