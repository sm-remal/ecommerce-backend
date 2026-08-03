import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import {
    buildPagination,
    buildProductOrderBy,
    buildProductWhereClause,
    calculateStockStatus,
    ensureProductBrandExists,
    ensureProductCategoryExists,
    ensureProductSkuIsUnique,
    generateUniqueProductSlug,
    mapProduct,
    parseDateValue,
    productInclude,
    syncProductImages,
    syncProductTags,
    validateProductPayload,
} from "./product.validation";
import { responseMessages } from "../../utility/responseMessages";
import type {
    CreateProductPayload,
    ProductListFilters,
    ProductListResponse,
    UpdateProductPayload,
} from "./product.interface";

const getProductWithRelations = async (id: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: productInclude,
        });

        if (!product) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapProduct(product);
    } catch (error) {
        throw error;
    }
};

const createProduct = async (payload: CreateProductPayload, userId?: string) => {
    try {
        validateProductPayload(payload);

        const name = payload.name.trim();
        const sku = payload.sku.trim();
        const stock = Number.isFinite(payload.stock) ? Number(payload.stock) : 0;
        const lowStockThreshold = Number.isFinite(payload.lowStockThreshold) ? Number(payload.lowStockThreshold) : 3;
        const stockStatus = calculateStockStatus(stock, lowStockThreshold, payload.stockStatus);
        const slug = await generateUniqueProductSlug(payload.slug?.trim() || name);

        await ensureProductCategoryExists(payload.categoryId);
        await ensureProductBrandExists(payload.brandId);
        await ensureProductSkuIsUnique(sku);

        const product = await prisma.$transaction(async (tx) => {
            const createdProduct = await tx.product.create({
                data: {
                    name,
                    slug,
                    sku,
                    description: payload.description?.trim() || null,
                    shortDescription: payload.shortDescription?.trim() || null,
                    categoryId: payload.categoryId,
                    brandId: payload.brandId || null,
                    price: payload.price,
                    salePrice: payload.salePrice ?? null,
                    costPrice: payload.costPrice ?? null,
                    discountType: payload.discountType ?? null,
                    discountValue: payload.discountValue ?? null,
                    discountStartAt: parseDateValue(payload.discountStartAt),
                    discountEndAt: parseDateValue(payload.discountEndAt),
                    stock,
                    lowStockThreshold,
                    stockStatus,
                    status: payload.status ?? "DRAFT",
                    isFeatured: Boolean(payload.isFeatured),
                    isTrending: Boolean(payload.isTrending),
                    isNewArrival: Boolean(payload.isNewArrival),
                    metaTitle: payload.metaTitle?.trim() || null,
                    metaDescription: payload.metaDescription?.trim() || null,
                    metaKeywords: payload.metaKeywords?.trim() || null,
                    createdById: userId || null,
                    updatedById: userId || null,
                },
            });

            await tx.inventory.create({
                data: {
                    productId: createdProduct.id,
                    quantity: stock,
                    lowStockThreshold,
                },
            });

            if (stock > 0) {
                await tx.inventoryLog.create({
                    data: {
                        productId: createdProduct.id,
                        productName: createdProduct.name,
                        type: "INCREASE",
                        quantity: stock,
                        note: "Initial product stock",
                        createdById: userId || null,
                    },
                });
            }

            await syncProductImages(tx, createdProduct.id, payload.images);
            await syncProductTags(tx, createdProduct.id, payload.tags);

            return tx.product.findUnique({
                where: { id: createdProduct.id },
                include: productInclude,
            });
        });

        if (!product) {
            throw new AppError(500, responseMessages.common.serverError);
        }

        return mapProduct(product);
    } catch (error) {
        throw error;
    }
};

const getProducts = async (filters: ProductListFilters = {}): Promise<ProductListResponse> => {
    try {
        const where = buildProductWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy: buildProductOrderBy(filters.sortBy),
                skip,
                take: limit,
                include: productInclude,
            }),
            prisma.product.count({ where }),
        ]);

        return {
            items: products.map((product) => mapProduct(product)),
            meta: {
                total,
                page,
                limit,
                totalPage: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        throw error;
    }
};

const getProductById = async (id: string) => {
    try {
        return getProductWithRelations(id);
    } catch (error) {
        throw error;
    }
};

const getProductBySlug = async (slug: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: productInclude,
        });

        if (!product) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapProduct(product);
    } catch (error) {
        throw error;
    }
};

const updateProduct = async (id: string, payload: UpdateProductPayload, userId?: string) => {
    try {
        validateProductPayload(payload, true);

        const existingProduct = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                slug: true,
                sku: true,
                stock: true,
                lowStockThreshold: true,
            },
        });

        if (!existingProduct) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        if (payload.categoryId) {
            await ensureProductCategoryExists(payload.categoryId);
        }

        if (typeof payload.brandId !== "undefined") {
            await ensureProductBrandExists(payload.brandId);
        }

        const nextSku = payload.sku?.trim();
        if (nextSku) {
            await ensureProductSkuIsUnique(nextSku, id);
        }

        const nextName = payload.name?.trim();
        const nextSlugSource = payload.slug?.trim() || nextName || existingProduct.slug;
        const slug = await generateUniqueProductSlug(nextSlugSource, id);
        const stock = typeof payload.stock !== "undefined" ? Number(payload.stock) : existingProduct.stock;
        const lowStockThreshold = typeof payload.lowStockThreshold !== "undefined"
            ? Number(payload.lowStockThreshold)
            : existingProduct.lowStockThreshold;
        const stockStatus = calculateStockStatus(stock, lowStockThreshold, payload.stockStatus);

        const product = await prisma.$transaction(async (tx) => {
            await tx.product.update({
                where: { id },
                data: {
                    ...(nextName ? { name: nextName } : {}),
                    slug,
                    ...(nextSku ? { sku: nextSku } : {}),
                    ...(typeof payload.description !== "undefined" ? { description: payload.description?.trim() || null } : {}),
                    ...(typeof payload.shortDescription !== "undefined" ? { shortDescription: payload.shortDescription?.trim() || null } : {}),
                    ...(typeof payload.categoryId !== "undefined" ? { categoryId: payload.categoryId } : {}),
                    ...(typeof payload.brandId !== "undefined" ? { brandId: payload.brandId || null } : {}),
                    ...(typeof payload.price !== "undefined" ? { price: payload.price } : {}),
                    ...(typeof payload.salePrice !== "undefined" ? { salePrice: payload.salePrice } : {}),
                    ...(typeof payload.costPrice !== "undefined" ? { costPrice: payload.costPrice } : {}),
                    ...(typeof payload.discountType !== "undefined" ? { discountType: payload.discountType } : {}),
                    ...(typeof payload.discountValue !== "undefined" ? { discountValue: payload.discountValue } : {}),
                    ...(typeof payload.discountStartAt !== "undefined" ? { discountStartAt: parseDateValue(payload.discountStartAt) } : {}),
                    ...(typeof payload.discountEndAt !== "undefined" ? { discountEndAt: parseDateValue(payload.discountEndAt) } : {}),
                    ...(typeof payload.stock !== "undefined" ? { stock } : {}),
                    ...(typeof payload.lowStockThreshold !== "undefined" ? { lowStockThreshold } : {}),
                    ...(
                        typeof payload.stock !== "undefined"
                        || typeof payload.lowStockThreshold !== "undefined"
                        || typeof payload.stockStatus !== "undefined"
                            ? { stockStatus }
                            : {}
                    ),
                    ...(typeof payload.status !== "undefined" ? { status: payload.status } : {}),
                    ...(typeof payload.isFeatured !== "undefined" ? { isFeatured: payload.isFeatured } : {}),
                    ...(typeof payload.isTrending !== "undefined" ? { isTrending: payload.isTrending } : {}),
                    ...(typeof payload.isNewArrival !== "undefined" ? { isNewArrival: payload.isNewArrival } : {}),
                    ...(typeof payload.metaTitle !== "undefined" ? { metaTitle: payload.metaTitle?.trim() || null } : {}),
                    ...(typeof payload.metaDescription !== "undefined" ? { metaDescription: payload.metaDescription?.trim() || null } : {}),
                    ...(typeof payload.metaKeywords !== "undefined" ? { metaKeywords: payload.metaKeywords?.trim() || null } : {}),
                    updatedById: userId || null,
                },
            });

            if (typeof payload.stock !== "undefined" || typeof payload.lowStockThreshold !== "undefined") {
                await tx.inventory.upsert({
                    where: { productId: id },
                    update: {
                        quantity: stock,
                        lowStockThreshold,
                    },
                    create: {
                        productId: id,
                        quantity: stock,
                        lowStockThreshold,
                    },
                });

                const quantityDifference = stock - existingProduct.stock;
                if (quantityDifference !== 0) {
                    await tx.inventoryLog.create({
                        data: {
                            productId: id,
                            productName: nextName || existingProduct.name,
                            type: quantityDifference > 0 ? "INCREASE" : "DECREASE",
                            quantity: Math.abs(quantityDifference),
                            note: "Product stock updated",
                            createdById: userId || null,
                        },
                    });
                }
            }

            await syncProductImages(tx, id, payload.images);
            await syncProductTags(tx, id, payload.tags);

            return tx.product.findUnique({
                where: { id },
                include: productInclude,
            });
        });

        if (!product) {
            throw new AppError(500, responseMessages.common.serverError);
        }

        return mapProduct(product);
    } catch (error) {
        throw error;
    }
};

const deleteProduct = async (id: string) => {
    try {
        const existingProduct = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                orderItems: {
                    select: { id: true },
                    take: 1,
                },
            },
        });

        if (!existingProduct) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        if (existingProduct.orderItems.length > 0) {
            const archivedProduct = await prisma.product.update({
                where: { id },
                data: { status: "ARCHIVED" },
                include: productInclude,
            });

            return mapProduct(archivedProduct);
        }

        const deletedProduct = await prisma.product.delete({
            where: { id },
        });

        return {
            id: deletedProduct.id,
            name: deletedProduct.name,
        };
    } catch (error) {
        throw error;
    }
};

export const ProductService = {
    createProduct,
    getProducts,
    getProductById,
    getProductBySlug,
    updateProduct,
    deleteProduct,
};
