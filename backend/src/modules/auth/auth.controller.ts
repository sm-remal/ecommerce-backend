import type { CookieOptions, Request, Response } from "express";
import config from "../../config";
import { AuthService } from "./auth.service";
import type { AuthResponse } from "./auth.interface";

type AuthenticatedRequest = Request & {
    user?: {
        id: string;
        email: string;
    };
};

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

const sendError = (res: Response, error: unknown, statusCode = 400) => {
    const message = error instanceof Error ? error.message : "Something went wrong";

    res.status(statusCode).json({
        success: false,
        message,
    });
};

const register = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.register(req.body);
        setAuthCookies(res, result);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: { user: result.user },
        });
    } catch (error) {
        sendError(res, error);
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.login(req.body);
        setAuthCookies(res, result);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: { user: result.user },
        });
    } catch (error) {
        sendError(res, error, 401);
    }
};

const forgotPassword = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.forgotPassword(req.body);
        const responseData = config.node_env === "production"
            ? { expiresAt: result.expiresAt }
            : result;

        res.status(200).json({
            success: true,
            message: result.message,
            data: responseData,
        });
    } catch (error) {
        sendError(res, error);
    }
};

const resetPassword = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.resetPassword(req.body);
        clearAuthCookies(res);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        sendError(res, error);
    }
};

const changePassword = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const result = await AuthService.changePassword(req.user.id, req.body);
        clearAuthCookies(res);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        sendError(res, error);
    }
};

const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.[refreshTokenCookieName] as string | undefined;
        const result = await AuthService.refreshToken(token || "");
        setAuthCookies(res, result);

        res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: { user: result.user },
        });
    } catch (error) {
        clearAuthCookies(res);
        sendError(res, error, 401);
    }
};

const logout = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const result = await AuthService.logout(req.user?.id);
        clearAuthCookies(res);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        sendError(res, error);
    }
};

const me = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const user = await AuthService.getCurrentUser(req.user.id);

        res.status(200).json({
            success: true,
            message: "Current user fetched successfully",
            data: { user },
        });
    } catch (error) {
        sendError(res, error, 401);
    }
};

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
