import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import {
    buildProductImageWhereClause,
    ensureProductExists,
    ensureProductHasThumbnail,
    mapProductImage,
    productImageInclude,
    unsetOtherProductThumbnails,
    validateProductImagePayload,
} from "./productImage.validation";
import { responseMessages } from "../../utility/responseMessages";
import type {
    CreateProductImagePayload,
    ProductImageListFilters,
    UpdateProductImagePayload,
} from "./productImage.interface";

const createProductImage = async (payload: CreateProductImagePayload) => {
    try {
        validateProductImagePayload(payload);

        const productId = payload.productId.trim();
        await ensureProductExists(productId);

        const image = await prisma.$transaction(async (tx) => {
            if (payload.isThumbnail) {
                await unsetOtherProductThumbnails(tx, productId);
            }

            const createdImage = await tx.productImage.create({
                data: {
                    productId,
                    url: payload.url.trim(),
                    altText: payload.altText?.trim() || null,
                    isThumbnail: Boolean(payload.isThumbnail),
                    sortOrder: Number.isFinite(payload.sortOrder) ? Number(payload.sortOrder) : 0,
                },
                include: productImageInclude,
            });

            await ensureProductHasThumbnail(tx, productId);

            return createdImage;
        });

        return mapProductImage(image);
    } catch (error) {
        throw error;
    }
};

const getProductImages = async (filters: ProductImageListFilters = {}) => {
    try {
        const where = buildProductImageWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);
        const [images, total] = await Promise.all([
            prisma.productImage.findMany({
                where,
                orderBy: [
                    { productId: "asc" },
                    { isThumbnail: "desc" },
                    { sortOrder: "asc" },
                ],
                skip,
                take: limit,
                include: productImageInclude,
            }),
            prisma.productImage.count({ where }),
        ]);

        return {
            items: images.map((image) => mapProductImage(image)),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getProductImageById = async (id: string) => {
    try {
        const image = await prisma.productImage.findUnique({
            where: { id },
            include: productImageInclude,
        });

        if (!image) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapProductImage(image);
    } catch (error) {
        throw error;
    }
};

const updateProductImage = async (id: string, payload: UpdateProductImagePayload) => {
    try {
        validateProductImagePayload(payload, true);

        const existingImage = await prisma.productImage.findUnique({
            where: { id },
            select: {
                id: true,
                productId: true,
                isThumbnail: true,
            },
        });

        if (!existingImage) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const productId = payload.productId?.trim() || existingImage.productId;
        if (payload.productId) {
            await ensureProductExists(productId);
        }

        const image = await prisma.$transaction(async (tx) => {
            if (payload.isThumbnail) {
                await unsetOtherProductThumbnails(tx, productId, id);
            }

            const updatedImage = await tx.productImage.update({
                where: { id },
                data: {
                    ...(typeof payload.productId !== "undefined" ? { productId } : {}),
                    ...(typeof payload.url !== "undefined" ? { url: payload.url.trim() } : {}),
                    ...(typeof payload.altText !== "undefined" ? { altText: payload.altText?.trim() || null } : {}),
                    ...(typeof payload.isThumbnail !== "undefined" ? { isThumbnail: payload.isThumbnail } : {}),
                    ...(typeof payload.sortOrder !== "undefined" ? { sortOrder: Number(payload.sortOrder) } : {}),
                },
                include: productImageInclude,
            });

            await ensureProductHasThumbnail(tx, existingImage.productId);
            await ensureProductHasThumbnail(tx, productId);

            return updatedImage;
        });

        return mapProductImage(image);
    } catch (error) {
        throw error;
    }
};

const deleteProductImage = async (id: string) => {
    try {
        const existingImage = await prisma.productImage.findUnique({
            where: { id },
            select: {
                id: true,
                productId: true,
                url: true,
                isThumbnail: true,
            },
        });

        if (!existingImage) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const deletedImage = await prisma.$transaction(async (tx) => {
            const image = await tx.productImage.delete({
                where: { id },
            });

            if (existingImage.isThumbnail) {
                await ensureProductHasThumbnail(tx, existingImage.productId);
            }

            return image;
        });

        return {
            id: deletedImage.id,
            productId: deletedImage.productId,
            url: deletedImage.url,
        };
    } catch (error) {
        throw error;
    }
};

export const ProductImageService = {
    createProductImage,
    getProductImages,
    getProductImageById,
    updateProductImage,
    deleteProductImage,
};
