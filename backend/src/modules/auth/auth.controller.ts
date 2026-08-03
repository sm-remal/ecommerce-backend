import type { CookieOptions, Request, Response } from "express";
import config from "../../config";
import type { AuthenticatedRequest } from "../../middleware/auth";
import { AppError } from "../../utility/AppError";
import asyncHandler from "../../utility/asyncHandler";
import { AuthService } from "./auth.service";
import type { AuthResponse } from "./auth.interface";

const accessTokenCookieName = "accessToken";
const refreshTokenCookieName = "refreshToken";

const cookieBaseOptions: CookieOptions = {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: config.node_env === "production" ? "none" : "lax",
    path: "/",
};

const accessTokenCookieOptions: CookieOptions = {
    ...cookieBaseOptions,
    maxAge: 30 * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
    ...cookieBaseOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const setAuthCookies = (res: Response, tokens: Pick<AuthResponse, "accessToken" | "refreshToken">) => {
    res.cookie(accessTokenCookieName, tokens.accessToken, accessTokenCookieOptions);
    res.cookie(refreshTokenCookieName, tokens.refreshToken, refreshTokenCookieOptions);
};

const clearAuthCookies = (res: Response) => {
    res.clearCookie(accessTokenCookieName, cookieBaseOptions);
    res.clearCookie(refreshTokenCookieName, cookieBaseOptions);
};

const register = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    setAuthCookies(res, result);

    res.status(201).json({
        success: true,
        message: "Registration successful",
        data: { user: result.user },
    });
});

const login = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    setAuthCookies(res, result);

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: { user: result.user },
    });
});

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.forgotPassword(req.body);
    const responseData = config.node_env === "production"
        ? { expiresAt: result.expiresAt }
        : result;

    res.status(200).json({
        success: true,
        message: result.message,
        data: responseData,
    });
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.resetPassword(req.body);
    clearAuthCookies(res);

    res.status(200).json({
        success: true,
        message: result.message,
    });
});

const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
        throw new AppError(401, "Unauthorized");
    }

    const result = await AuthService.changePassword(req.user.id, req.body);
    clearAuthCookies(res);

    res.status(200).json({
        success: true,
        message: result.message,
    });
});

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.[refreshTokenCookieName] as string | undefined;

    try {
        const result = await AuthService.refreshToken(token || "");
        setAuthCookies(res, result);

        res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: { user: result.user },
        });
    } catch (error) {
        clearAuthCookies(res);
        throw error;
    }
});

const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await AuthService.logout(req.user?.id);
    clearAuthCookies(res);

    res.status(200).json({
        success: true,
        message: result.message,
    });
});

const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
        throw new AppError(401, "Unauthorized");
    }

    const user = await AuthService.getCurrentUser(req.user.id);

    res.status(200).json({
        success: true,
        message: "Current user fetched successfully",
        data: { user },
    });
});

export const AuthController = {
    register,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshToken,
    logout,
    me,
};
