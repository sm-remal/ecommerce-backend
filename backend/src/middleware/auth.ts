import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthService } from "../modules/auth/auth.service";
import { AppError } from "../utility/AppError";

type AuthenticatedUser = {
    id: string;
    email: string;
    type: "USER" | "ADMIN";
    roles: string[];
    permissions: string[];
};

export type AuthenticatedRequest = Request & {
    user?: AuthenticatedUser;
};

const getTokenFromRequest = (req: Request) => {
    const cookieToken = req.cookies?.accessToken as string | undefined;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : undefined;

    return cookieToken || bearerToken;
};

const getAuthenticatedUser = async (userId: string): Promise<AuthenticatedUser> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            type: true,
            status: true,
            roles: {
                select: {
                    role: {
                        select: {
                            name: true,
                            permissions: {
                                select: {
                                    permission: {
                                        select: {
                                            name: true,
                                            module: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!user) {
        throw new AppError(401, "Unauthorized");
    }

    if (user.status !== "ACTIVE") {
        throw new AppError(403, "Account is not active");
    }

    const roles = user.roles.map((userRole) => userRole.role.name);
    const permissions = user.roles.flatMap((userRole) => userRole.role.permissions.flatMap(({ permission }) => [
        permission.name,
        `${permission.module}.${permission.name}`,
    ]));

    return {
        id: user.id,
        email: user.email,
        type: user.type,
        roles,
        permissions: Array.from(new Set(permissions)),
    };
};

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = getTokenFromRequest(req);

        if (!token) {
            next(new AppError(401, "Unauthorized"));
            return;
        }

        const decoded = AuthService.verifyAccessToken(token);
        req.user = await getAuthenticatedUser(decoded.userId);

        next();
    } catch (error) {
        next(error instanceof AppError ? error : new AppError(401, "Unauthorized"));
    }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
        next(new AppError(401, "Unauthorized"));
        return;
    }

    if (req.user.type !== "ADMIN") {
        next(new AppError(403, "Forbidden: admin access required"));
        return;
    }

    next();
};

export const requirePermission = (...requiredPermissions: string[]) => (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    if (!req.user?.id) {
        next(new AppError(401, "Unauthorized"));
        return;
    }

    if (req.user.type === "ADMIN") {
        next();
        return;
    }

    const userPermissions = new Set(req.user.permissions || []);
    const hasPermissions = requiredPermissions.every((permission) => userPermissions.has(permission));

    if (!hasPermissions) {
        next(new AppError(403, "Forbidden: permission denied"));
        return;
    }

    next();
};
