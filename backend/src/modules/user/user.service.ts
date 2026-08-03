import bcrypt from "bcrypt";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import { responseMessages } from "../../utility/responseMessages";
import type { CreateUserPayload, UpdateProfilePayload, UpdateUserPayload, UserListFilters } from "./user.interface";
import { buildUserWhereClause, mapUser } from "./user.validation";

const getSaltRounds = () => Number(config.bcrypt_salt_rounds || 12);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const ensureEmailIsUnique = async (email: string, excludeId?: string) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizeEmail(email) },
            select: { id: true },
        });

        if (existingUser && existingUser.id !== excludeId) {
            throw new AppError(409, "Email already registered");
        }
    } catch (error) {
        throw error;
    }
};

const createUser = async (payload: CreateUserPayload) => {
    try {
        await ensureEmailIsUnique(payload.email);

        const password = await bcrypt.hash(payload.password, getSaltRounds());
        const user = await prisma.user.create({
            data: {
                name: payload.name.trim(),
                email: normalizeEmail(payload.email),
                password,
                phone: payload.phone?.trim() || null,
                avatar: payload.avatar?.trim() || null,
                type: payload.type ?? "USER",
                status: payload.status ?? "ACTIVE",
            },
        });

        return mapUser(user);
    } catch (error) {
        throw error;
    }
};

const getUsers = async (filters: UserListFilters = {}) => {
    try {
        const where = buildUserWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                orderBy: [
                    { createdAt: "desc" },
                ],
                skip,
                take: limit,
            }),
            prisma.user.count({ where }),
        ]);

        return {
            items: users.map((user) => mapUser(user)),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapUser(user);
    } catch (error) {
        throw error;
    }
};

const updateUser = async (id: string, payload: UpdateUserPayload) => {
    try {
        await getUserById(id);

        if (payload.email) {
            await ensureEmailIsUnique(payload.email, id);
        }

        const password = payload.password
            ? await bcrypt.hash(payload.password, getSaltRounds())
            : undefined;

        const user = await prisma.user.update({
            where: { id },
            data: {
                ...(typeof payload.name !== "undefined" ? { name: payload.name.trim() } : {}),
                ...(typeof payload.email !== "undefined" ? { email: normalizeEmail(payload.email) } : {}),
                ...(typeof password !== "undefined" ? { password, refreshTokenHash: null, passwordChangedAt: new Date() } : {}),
                ...(typeof payload.phone !== "undefined" ? { phone: payload.phone?.trim() || null } : {}),
                ...(typeof payload.avatar !== "undefined" ? { avatar: payload.avatar?.trim() || null } : {}),
                ...(typeof payload.type !== "undefined" ? { type: payload.type } : {}),
                ...(typeof payload.status !== "undefined" ? { status: payload.status } : {}),
            },
        });

        return mapUser(user);
    } catch (error) {
        throw error;
    }
};

const getProfile = async (userId: string) => {
    try {
        return getUserById(userId);
    } catch (error) {
        throw error;
    }
};

const updateProfile = async (userId: string, payload: UpdateProfilePayload) => {
    try {
        await getUserById(userId);

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(typeof payload.name !== "undefined" ? { name: payload.name.trim() } : {}),
                ...(typeof payload.phone !== "undefined" ? { phone: payload.phone?.trim() || null } : {}),
                ...(typeof payload.avatar !== "undefined" ? { avatar: payload.avatar?.trim() || null } : {}),
            },
        });

        return mapUser(user);
    } catch (error) {
        throw error;
    }
};

const deleteUser = async (id: string) => {
    try {
        await getUserById(id);

        const deletedUser = await prisma.user.delete({
            where: { id },
        });

        return {
            id: deletedUser.id,
            email: deletedUser.email,
        };
    } catch (error) {
        throw error;
    }
};

export const UserService = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    getProfile,
    updateProfile,
    deleteUser,
};
