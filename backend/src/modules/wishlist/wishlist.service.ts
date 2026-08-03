import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import { responseMessages } from "../../utility/responseMessages";
import type { CreateWishlistPayload, WishlistListFilters } from "./wishlist.interface";
import {
    buildWishlistWhereClause,
    mapWishlist,
    wishlistInclude,
} from "./wishlist.validation";

const ensureWishlistProductExists = async (productId: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { id: true },
        });

        if (!product) {
            throw new AppError(404, "Product not found");
        }
    } catch (error) {
        throw error;
    }
};

const addToWishlist = async (userId: string, payload: CreateWishlistPayload) => {
    try {
        await ensureWishlistProductExists(payload.productId);

        const existingWishlist = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId: payload.productId,
                },
            },
            include: wishlistInclude,
        });

        if (existingWishlist) {
            return mapWishlist(existingWishlist);
        }

        const wishlist = await prisma.wishlist.create({
            data: {
                userId,
                productId: payload.productId,
            },
            include: wishlistInclude,
        });

        return mapWishlist(wishlist);
    } catch (error) {
        throw error;
    }
};

const getWishlist = async (userId: string, filters: WishlistListFilters = {}) => {
    try {
        const where = buildWishlistWhereClause(userId, filters);
        const { page, limit, skip } = buildPagination(filters);
        const [wishlists, total] = await Promise.all([
            prisma.wishlist.findMany({
                where,
                orderBy: [
                    { createdAt: "desc" },
                ],
                skip,
                take: limit,
                include: wishlistInclude,
            }),
            prisma.wishlist.count({ where }),
        ]);

        return {
            items: wishlists.map((wishlist) => mapWishlist(wishlist)),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getWishlistItemById = async (userId: string, id: string) => {
    try {
        const wishlist = await prisma.wishlist.findFirst({
            where: { id, userId },
            include: wishlistInclude,
        });

        if (!wishlist) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapWishlist(wishlist);
    } catch (error) {
        throw error;
    }
};

const removeWishlistItem = async (userId: string, id: string) => {
    try {
        await getWishlistItemById(userId, id);

        const deletedWishlist = await prisma.wishlist.delete({
            where: { id },
        });

        return {
            id: deletedWishlist.id,
            productId: deletedWishlist.productId,
        };
    } catch (error) {
        throw error;
    }
};

const removeWishlistByProductId = async (userId: string, productId: string) => {
    try {
        const wishlist = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
            select: { id: true },
        });

        if (!wishlist) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return removeWishlistItem(userId, wishlist.id);
    } catch (error) {
        throw error;
    }
};

const clearWishlist = async (userId: string) => {
    try {
        const result = await prisma.wishlist.deleteMany({
            where: { userId },
        });

        return {
            deletedCount: result.count,
        };
    } catch (error) {
        throw error;
    }
};

export const WishlistService = {
    addToWishlist,
    getWishlist,
    getWishlistItemById,
    removeWishlistItem,
    removeWishlistByProductId,
    clearWishlist,
};
