import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import {
    changePasswordSchema,
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
} from "./auth.validation";

const router = Router();

router.post("/register", validateRequest({ body: registerSchema }), AuthController.register);
router.post("/login", validateRequest({ body: loginSchema }), AuthController.login);
router.post("/forgot-password", validateRequest({ body: forgotPasswordSchema }), AuthController.forgotPassword);
router.post("/reset-password", validateRequest({ body: resetPasswordSchema }), AuthController.resetPassword);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/change-password", authMiddleware, validateRequest({ body: changePasswordSchema }), AuthController.changePassword);
router.post("/logout", authMiddleware, AuthController.logout);
router.get("/me", authMiddleware, AuthController.me);

export const AuthRoutes = router;
