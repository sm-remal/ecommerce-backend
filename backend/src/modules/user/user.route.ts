import { Router } from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import {
    parseCreateUserPayload,
    parseUpdateProfilePayload,
    parseUpdateUserPayload,
    parseUserListFilters,
} from "./user.validation";

const router = Router();

router.get("/me", authMiddleware, UserController.getProfile);
router.patch("/me", authMiddleware, validateRequest({ body: parseUpdateProfilePayload }), UserController.updateProfile);
router.get("/", authMiddleware, requireAdmin, validateRequest({ query: parseUserListFilters }), UserController.getUsers);
router.get("/:id", authMiddleware, requireAdmin, UserController.getUserById);
router.post("/", authMiddleware, requireAdmin, validateRequest({ body: parseCreateUserPayload }), UserController.createUser);
router.patch("/:id", authMiddleware, requireAdmin, validateRequest({ body: parseUpdateUserPayload }), UserController.updateUser);
router.delete("/:id", authMiddleware, requireAdmin, UserController.deleteUser);

export const UserRoutes = router;
