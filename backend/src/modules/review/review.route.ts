import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { ReviewController } from "./review.controller";
import {
    createReviewSchema,
    reviewListQuerySchema,
    updateReviewSchema,
    updateReviewStatusSchema,
} from "./review.validation";

const router = Router();

router.get("/", validateRequest({ query: reviewListQuerySchema }), ReviewController.getReviews);
router.get("/product/:productId/stats", ReviewController.getReviewStatsByProduct);
router.get("/:id", ReviewController.getReviewById);
router.post("/", validateRequest({ body: createReviewSchema }), ReviewController.createReview);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: updateReviewSchema }), ReviewController.updateReview);
router.patch("/:id/status", authMiddleware, requireAdmin, validateRequest({ body: updateReviewStatusSchema }), ReviewController.updateReviewStatus);
router.delete("/:id", authMiddleware, requireAdmin, ReviewController.deleteReview);

export const ReviewRoutes = router;
