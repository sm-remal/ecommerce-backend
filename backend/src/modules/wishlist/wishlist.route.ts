import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { WishlistController } from "./wishlist.controller";
import { createWishlistSchema, wishlistListQuerySchema } from "./wishlist.validation";

const router = Router();

router.get("/", authMiddleware, validateRequest({ query: wishlistListQuerySchema }), WishlistController.getMyWishlist);
router.get("/:id", authMiddleware, WishlistController.getWishlistItemById);
router.post("/", authMiddleware, validateRequest({ body: createWishlistSchema }), WishlistController.addToWishlist);
router.delete("/", authMiddleware, WishlistController.clearWishlist);
router.delete("/product/:productId", authMiddleware, WishlistController.removeWishlistByProductId);
router.delete("/:id", authMiddleware, WishlistController.removeWishlistItem);

export const WishlistRoutes = router;
