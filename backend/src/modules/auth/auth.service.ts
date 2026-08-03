import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt, { type JwtPayload, type Secret, type SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import type {
    AuthResponse,
    AuthTokens,
    AuthUser,
    ChangePasswordPayload,
    ForgotPasswordPayload,
    LoginPayload,
    RegisterPayload,
    ResetPasswordPayload,
} from "./auth.interface";

type TokenPayload = JwtPayload & {
    userId: string;
    email: string;
};

const requireEnv = (value: string | undefined, name: string): string => {
    if (!value) {
        throw new Error(`${name} is not configured`);
    }

    return value;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const validateEmail = (email: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
        throw new Error("Valid email is required");
    }
};

const validatePassword = (password: string, fieldName = "Password") => {
    if (!password || password.length < 8) {
        throw new Error(`${fieldName} must be at least 8 characters`);
    }
};

const mapUser = (user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    type: string;
    status: string;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
}): AuthUser => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    type: user.type,
    status: user.status,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

const getCurrentUser = async (userId: string): Promise<AuthUser> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        return mapUser(user);
    } catch (error) {
        throw error;
    }
};

const getSaltRounds = () => Number(config.bcrypt_salt_rounds || 12);

const getAccessSecret = () => requireEnv(config.jwt_access_secrete, "JWT_ACCESS_SECRETE");

const getRefreshSecret = () => requireEnv(config.jwt_refresh_secrete, "JWT_REFRESH_SECRETE");

const signToken = (
    payload: TokenPayload,
    secret: string,
    expiresIn: SignOptions["expiresIn"],
) => jwt.sign(payload, secret as Secret, { expiresIn } as SignOptions);

const createTokens = (user: { id: string; email: string }): AuthTokens => {
    const payload = {
        userId: user.id,
        email: user.email,
    };

    return {
        accessToken: signToken(
            payload,
            getAccessSecret(),
            (config.jwt_access_expires_in || "30m") as SignOptions["expiresIn"],
        ),
        refreshToken: signToken(
            payload,
            getRefreshSecret(),
            (config.jwt_refresh_expires_in || "7d") as SignOptions["expiresIn"],
        ),
    };
};

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

const saveRefreshToken = async (userId: string, refreshToken: string) => {
    const refreshTokenHash = await bcrypt.hash(refreshToken, getSaltRounds());

    await prisma.user.update({
        where: { id: userId },
        data: { refreshTokenHash },
    });
};

const buildAuthResponse = async (user: AuthUser): Promise<AuthResponse> => {
    const tokens = createTokens(user);
    await saveRefreshToken(user.id, tokens.refreshToken);

    return {
        user,
        ...tokens,
    };
};

const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
        const name = payload.name?.trim();
        const email = normalizeEmail(payload.email || "");
        const phone = payload.phone?.trim();

        if (!name) {
            throw new Error("Name is required");
        }

        validateEmail(email);
        validatePassword(payload.password);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("Email already registered");
        }

        const password = await bcrypt.hash(payload.password, getSaltRounds());
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone: phone || null,
                password,
            },
        });

        return buildAuthResponse(mapUser(user));
    } catch (error) {
        throw error;
    }
};

const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
        const email = normalizeEmail(payload.email || "");
        validateEmail(email);

        if (!payload.password) {
            throw new Error("Password is required");
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error("Invalid email or password");
        }

        if (user.status !== "ACTIVE") {
            throw new Error("Account is not active");
        }

        const isPasswordValid = await bcrypt.compare(payload.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });

        return buildAuthResponse(mapUser(updatedUser));
    } catch (error) {
        throw error;
    }
};

const forgotPassword = async (payload: ForgotPasswordPayload) => {
    try {
        const email = normalizeEmail(payload.email || "");
        validateEmail(email);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return {
                message: "If the email exists, password reset instructions will be sent.",
            };
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = hashToken(resetToken);
        const expiresInMinutes = Number(config.reset_token_expires_in_minutes || 15);
        const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt,
            },
        });

        return {
            message: "If the email exists, password reset instructions will be sent.",
            resetToken,
            expiresAt,
        };
    } catch (error) {
        throw error;
    }
};

const resetPassword = async (payload: ResetPasswordPayload) => {
    try {
        if (!payload.token) {
            throw new Error("Reset token is required");
        }

        validatePassword(payload.password);

        const tokenHash = hashToken(payload.token);
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });

        if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
            throw new Error("Reset token is invalid or expired");
        }

        const password = await bcrypt.hash(payload.password, getSaltRounds());

        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: {
                    password,
                    refreshTokenHash: null,
                    passwordChangedAt: new Date(),
                },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { usedAt: new Date() },
            }),
        ]);

        return { message: "Password reset successfully" };
    } catch (error) {
        throw error;
    }
};

const changePassword = async (userId: string, payload: ChangePasswordPayload) => {
    try {
        if (!payload.currentPassword) {
            throw new Error("Current password is required");
        }

        validatePassword(payload.newPassword, "New password");

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(payload.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        const password = await bcrypt.hash(payload.newPassword, getSaltRounds());
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password,
                refreshTokenHash: null,
                passwordChangedAt: new Date(),
            },
        });

        return { message: "Password changed successfully" };
    } catch (error) {
        throw error;
    }
};

const refreshToken = async (refreshTokenValue: string): Promise<AuthResponse> => {
    try {
        if (!refreshTokenValue) {
            throw new Error("Refresh token is required");
        }

        const decoded = jwt.verify(refreshTokenValue, getRefreshSecret()) as TokenPayload;
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user || !user.refreshTokenHash || user.status !== "ACTIVE") {
            throw new Error("Invalid refresh token");
        }

        const isTokenValid = await bcrypt.compare(refreshTokenValue, user.refreshTokenHash);
        if (!isTokenValid) {
            throw new Error("Invalid refresh token");
        }

        return buildAuthResponse(mapUser(user));
    } catch (error) {
        throw error;
    }
};

const logout = async (userId: string | undefined) => {
    try {
        if (userId) {
            await prisma.user.update({
                where: { id: userId },
                data: { refreshTokenHash: null },
            });
        }

        return { message: "Logged out successfully" };
    } catch (error) {
        throw error;
    }
};

const verifyAccessToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, getAccessSecret()) as TokenPayload;
    } catch (error) {
        throw error;
    }
};

export const AuthService = {
    register,
    login,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshToken,
    logout,
    verifyAccessToken,
};
