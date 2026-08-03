import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import { responseMessages } from "../../utility/responseMessages";
import type {
    CreateDiscountPayload,
    DiscountListFilters,
    SyncDiscountTargetsPayload,
    UpdateDiscountPayload,
} from "./discount.interface";
import {
    buildCreateDiscountData,
    buildDiscountWhereClause,
    buildUpdateDiscountData,
    discountInclude,
    mapDiscount,
    normalizeIds,
    validateDiscountPayload,
    validateSyncDiscountTargetsPayload,
} from "./discount.validation";

const ensureDiscountExists = async (id: string) => {
    try {
        const discount = await prisma.discount.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!discount) {
            throw new AppError(404, responseMessages.common.notFound);
        }
    } catch (error) {
        throw error;
    }
};

const ensureProductsExist = async (productIds: string[]) => {
    try {
        if (productIds.length === 0) {
            return;
        }

        const count = await prisma.product.count({
            where: { id: { in: productIds } },
        });

        if (count !== productIds.length) {
            throw new AppError(404, "One or more products were not found");
        }
    } catch (error) {
        throw error;
    }
};

const ensureCategoriesExist = async (categoryIds: string[]) => {
    try {
        if (categoryIds.length === 0) {
            return;
        }

        const count = await prisma.category.count({
            where: { id: { in: categoryIds } },
        });

        if (count !== categoryIds.length) {
            throw new AppError(404, "One or more categories were not found");
        }
    } catch (error) {
        throw error;
    }
};

const syncTargets = async (
    tx: any,
    discountId: string,
    payload: SyncDiscountTargetsPayload,
) => {
    try {
        if (typeof payload.productIds !== "undefined") {
            const productIds = normalizeIds(payload.productIds);

            await tx.discountProduct.deleteMany({
                where: { discountId },
            });

            if (productIds.length > 0) {
                await tx.discountProduct.createMany({
                    data: productIds.map((productId) => ({
                        discountId,
                        productId,
                    })),
                });
            }
        }

        if (typeof payload.categoryIds !== "undefined") {
            const categoryIds = normalizeIds(payload.categoryIds);

            await tx.discountCategory.deleteMany({
                where: { discountId },
            });

            if (categoryIds.length > 0) {
                await tx.discountCategory.createMany({
                    data: categoryIds.map((categoryId) => ({
                        discountId,
                        categoryId,
                    })),
                });
            }
        }
    } catch (error) {
        throw error;
    }
};

const buildSyncPayload = (productIds?: string[], categoryIds?: string[]): SyncDiscountTargetsPayload => ({
    ...(typeof productIds !== "undefined" ? { productIds } : {}),
    ...(typeof categoryIds !== "undefined" ? { categoryIds } : {}),
});

const createDiscount = async (payload: CreateDiscountPayload) => {
    try {
        validateDiscountPayload(payload);
        validateSyncDiscountTargetsPayload(payload);

        const productIds = normalizeIds(payload.productIds);
        const categoryIds = normalizeIds(payload.categoryIds);
        await ensureProductsExist(productIds);
        await ensureCategoriesExist(categoryIds);

        const discount = await prisma.$transaction(async (tx) => {
            const createdDiscount = await tx.discount.create({
                data: buildCreateDiscountData(payload),
            });

            await syncTargets(tx, createdDiscount.id, { productIds, categoryIds });

            return tx.discount.findUnique({
                where: { id: createdDiscount.id },
                include: discountInclude,
            });
        });

        if (!discount) {
            throw new AppError(500, responseMessages.common.serverError);
        }

        return mapDiscount(discount);
    } catch (error) {
        throw error;
    }
};

const getDiscounts = async (filters: DiscountListFilters = {}) => {
    try {
        const where = buildDiscountWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);
        const [discounts, total] = await Promise.all([
            prisma.discount.findMany({
                where,
                orderBy: [
                    { createdAt: "desc" },
                ],
                skip,
                take: limit,
                include: discountInclude,
            }),
            prisma.discount.count({ where }),
        ]);

        return {
            items: discounts.map((discount) => mapDiscount(discount)),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getDiscountById = async (id: string) => {
    try {
        const discount = await prisma.discount.findUnique({
            where: { id },
            include: discountInclude,
        });

        if (!discount) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapDiscount(discount);
    } catch (error) {
        throw error;
    }
};

const updateDiscount = async (id: string, payload: UpdateDiscountPayload) => {
    try {
        validateDiscountPayload(payload, true);
        validateSyncDiscountTargetsPayload(payload);
        await ensureDiscountExists(id);

        const productIds = typeof payload.productIds === "undefined" ? undefined : normalizeIds(payload.productIds);
        const categoryIds = typeof payload.categoryIds === "undefined" ? undefined : normalizeIds(payload.categoryIds);

        if (productIds) {
            await ensureProductsExist(productIds);
        }

        if (categoryIds) {
            await ensureCategoriesExist(categoryIds);
        }

        const discount = await prisma.$transaction(async (tx) => {
            await tx.discount.update({
                where: { id },
                data: buildUpdateDiscountData(payload),
            });

            await syncTargets(tx, id, buildSyncPayload(productIds, categoryIds));

            return tx.discount.findUnique({
                where: { id },
                include: discountInclude,
            });
        });

        if (!discount) {
            throw new AppError(500, responseMessages.common.serverError);
        }

        return mapDiscount(discount);
    } catch (error) {
        throw error;
    }
};

const syncDiscountTargets = async (id: string, payload: SyncDiscountTargetsPayload) => {
    try {
        validateSyncDiscountTargetsPayload(payload);
        await ensureDiscountExists(id);

        const productIds = typeof payload.productIds === "undefined" ? undefined : normalizeIds(payload.productIds);
        const categoryIds = typeof payload.categoryIds === "undefined" ? undefined : normalizeIds(payload.categoryIds);

        if (productIds) {
            await ensureProductsExist(productIds);
        }

        if (categoryIds) {
            await ensureCategoriesExist(categoryIds);
        }

        const discount = await prisma.$transaction(async (tx) => {
            await syncTargets(tx, id, buildSyncPayload(productIds, categoryIds));

            return tx.discount.findUnique({
                where: { id },
                include: discountInclude,
            });
        });

        if (!discount) {
            throw new AppError(500, responseMessages.common.serverError);
        }

        return mapDiscount(discount);
    } catch (error) {
        throw error;
    }
};

const deleteDiscount = async (id: string) => {
    try {
        await ensureDiscountExists(id);

        const deletedDiscount = await prisma.discount.delete({
            where: { id },
        });

        return {
            id: deletedDiscount.id,
            name: deletedDiscount.name,
        };
    } catch (error) {
        throw error;
    }
};

export const DiscountService = {
    createDiscount,
    getDiscounts,
    getDiscountById,
    updateDiscount,
    syncDiscountTargets,
    deleteDiscount,
};
