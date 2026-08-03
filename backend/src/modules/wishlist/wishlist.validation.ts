import { z } from "zod";
import type { Prisma } from "../../generated/prisma/client";
import { AppError } from "../../utility/AppError";
import type { CreateWishlistPayload, WishlistItem, WishlistListFilters } from "./wishlist.interface";

type WishlistRecord = {
    id: string;
    userId: string;
    productId: string;
    createdAt: Date;
    product: {
        id: string;
        name: string;
        slug: string;
        sku: string;
        price: unknown;
        salePrice: unknown | null;
        stockStatus: string;
        images: {
            url: string;
            isThumbnail: boolean;
            sortOrder: number;
        }[];
    };
};

export const createWishlistSchema = z.object({
    productId: z.string().trim().min(1),
});

export const wishlistListQuerySchema = z.object({
    search: z.string().trim().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
});

const formatZodMessage = (error: z.ZodError) => error.issues.map((issue) => issue.message).join(", ");

export const parseCreateWishlistPayload = (payload: unknown): CreateWishlistPayload => {
    try {
        return createWishlistSchema.parse(payload);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseWishlistListFilters = (query: unknown): WishlistListFilters => {
    try {
        const parsed = wishlistListQuerySchema.parse(query);

        return {
            ...(parsed.search ? { search: parsed.search } : {}),
            ...(typeof parsed.page !== "undefined" ? { page: parsed.page } : {}),
            ...(typeof parsed.limit !== "undefined" ? { limit: parsed.limit } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const wishlistInclude: Prisma.WishlistInclude = {
    product: {
        select: {
            id: true,
            name: true,
            slug: true,
            sku: true,
            price: true,
            salePrice: true,
            stockStatus: true,
            images: {
                orderBy: [
                    { isThumbnail: "desc" },
                    { sortOrder: "asc" },
                ],
                select: {
                    url: true,
                    isThumbnail: true,
                    sortOrder: true,
                },
            },
        },
    },
};

export const mapWishlist = (wishlist: WishlistRecord | any): WishlistItem => {
    const thumbnail = wishlist.product.images.find((image: WishlistRecord["product"]["images"][number]) => image.isThumbnail)
        || wishlist.product.images[0]
        || null;

    return {
        id: wishlist.id,
        userId: wishlist.userId,
        productId: wishlist.productId,
        createdAt: wishlist.createdAt,
        product: {
            id: wishlist.product.id,
            name: wishlist.product.name,
            slug: wishlist.product.slug,
            sku: wishlist.product.sku,
            price: Number(wishlist.product.price),
            salePrice: wishlist.product.salePrice === null ? null : Number(wishlist.product.salePrice),
            stockStatus: wishlist.product.stockStatus,
            thumbnail: thumbnail?.url || null,
        },
    };
};

export const buildWishlistWhereClause = (userId: string, filters: WishlistListFilters) => {
    const where: Record<string, unknown> = { userId };

    if (filters.search?.trim()) {
        const search = filters.search.trim();
        where.product = {
            OR: [
                { name: { contains: search } },
                { slug: { contains: search } },
                { sku: { contains: search } },
            ],
        };
    }

    return where;
};
