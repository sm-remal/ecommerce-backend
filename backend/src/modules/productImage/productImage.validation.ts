import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import type {
    CreateProductImagePayload,
    ProductImageItem,
    ProductImageListFilters,
    UpdateProductImagePayload,
} from "./productImage.interface";

type ProductImageRecord = {
    id: string;
    productId: string;
    url: string;
    altText: string | null;
    isThumbnail: boolean;
    sortOrder: number;
    product: {
        id: string;
        name: string;
        slug: string;
    };
};

export const productImageInclude = {
    product: {
        select: {
            id: true,
            name: true,
            slug: true,
        },
    },
};

export const getQueryValue = (value: unknown) => {
    if (Array.isArray(value)) {
        const firstValue = value[0];
        return typeof firstValue === "string" ? firstValue : undefined;
    }

    return typeof value === "string" ? value : undefined;
};

export const parseBoolean = (value: unknown): boolean | undefined => {
    const normalized = getQueryValue(value)?.toLowerCase();
    if (normalized === "true") {
        return true;
    }

    if (normalized === "false") {
        return false;
    }

    return undefined;
};

export const mapProductImage = (image: ProductImageRecord): ProductImageItem => ({
    id: image.id,
    productId: image.productId,
    url: image.url,
    altText: image.altText,
    isThumbnail: image.isThumbnail,
    sortOrder: image.sortOrder,
    product: image.product,
});

export const buildProductImageWhereClause = (filters: ProductImageListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.productId) {
        where.productId = filters.productId;
    }

    if (typeof filters.isThumbnail !== "undefined") {
        where.isThumbnail = filters.isThumbnail;
    }

    return where;
};

export const ensureProductExists = async (productId: string) => {
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

export const validateProductImagePayload = (
    payload: CreateProductImagePayload | UpdateProductImagePayload,
    isUpdate = false,
) => {
    const productId = payload.productId?.trim();
    const url = payload.url?.trim();

    if (!isUpdate && !productId) {
        throw new AppError(400, "Product id is required");
    }

    if (!isUpdate && !url) {
        throw new AppError(400, "Product image URL is required");
    }

    if (isUpdate && typeof payload.url !== "undefined" && !url) {
        throw new AppError(400, "Product image URL cannot be empty");
    }

    if (typeof payload.sortOrder !== "undefined" && !Number.isFinite(Number(payload.sortOrder))) {
        throw new AppError(400, "Valid sort order is required");
    }
};

export const unsetOtherProductThumbnails = async (tx: any, productId: string, excludeImageId?: string) => {
    try {
        await tx.productImage.updateMany({
            where: {
                productId,
                ...(excludeImageId ? { id: { not: excludeImageId } } : {}),
            },
            data: {
                isThumbnail: false,
            },
        });
    } catch (error) {
        throw error;
    }
};

export const ensureProductHasThumbnail = async (tx: any, productId: string) => {
    try {
        const thumbnail = await tx.productImage.findFirst({
            where: {
                productId,
                isThumbnail: true,
            },
            select: { id: true },
        });

        if (thumbnail) {
            return;
        }

        const firstImage = await tx.productImage.findFirst({
            where: { productId },
            orderBy: [
                { sortOrder: "asc" },
            ],
            select: { id: true },
        });

        if (firstImage) {
            await tx.productImage.update({
                where: { id: firstImage.id },
                data: { isThumbnail: true },
            });
        }
    } catch (error) {
        throw error;
    }
};
