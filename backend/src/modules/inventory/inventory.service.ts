import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import {
    buildInventoryWhereClause,
    calculateAdjustedQuantity,
    ensureInventoryProductExists,
    inventoryInclude,
    mapInventory,
    mapInventoryLog,
    syncProductInventorySnapshot,
    validateAdjustInventoryPayload,
    validateInventoryPayload,
} from "./inventory.validation";
import { responseMessages } from "../../utility/responseMessages";
import type {
    AdjustInventoryPayload,
    CreateInventoryPayload,
    InventoryListFilters,
    UpdateInventoryPayload,
} from "./inventory.interface";

const createInventory = async (payload: CreateInventoryPayload, userId?: string) => {
    try {
        validateInventoryPayload(payload);

        const productId = payload.productId.trim();
        const product = await ensureInventoryProductExists(productId);

        const existingInventory = await prisma.inventory.findUnique({
            where: { productId },
            select: { id: true },
        });

        if (existingInventory) {
            throw new AppError(409, "Inventory already exists for this product");
        }

        const quantity = typeof payload.quantity !== "undefined" ? Number(payload.quantity) : product.stock;
        const lowStockThreshold = typeof payload.lowStockThreshold !== "undefined"
            ? Number(payload.lowStockThreshold)
            : product.lowStockThreshold;
        const reservedQuantity = typeof payload.reservedQuantity !== "undefined" ? Number(payload.reservedQuantity) : 0;

        const inventory = await prisma.$transaction(async (tx) => {
            const createdInventory = await tx.inventory.create({
                data: {
                    productId,
                    quantity,
                    lowStockThreshold,
                    reservedQuantity,
                },
                include: inventoryInclude,
            });

            await syncProductInventorySnapshot(tx, productId, quantity, lowStockThreshold);

            if (quantity > 0) {
                await tx.inventoryLog.create({
                    data: {
                        productId,
                        productName: product.name,
                        type: "INCREASE",
                        quantity,
                        note: payload.note?.trim() || "Inventory created",
                        createdById: userId || null,
                    },
                });
            }

            return createdInventory;
        });

        return mapInventory(inventory);
    } catch (error) {
        throw error;
    }
};

const getInventories = async (filters: InventoryListFilters = {}) => {
    try {
        const where = buildInventoryWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);
        const [inventories, total] = await Promise.all([
            prisma.inventory.findMany({
                where,
                orderBy: [
                    { updatedAt: "desc" },
                ],
                skip,
                take: limit,
                include: inventoryInclude,
            }),
            prisma.inventory.count({ where }),
        ]);

        return {
            items: inventories.map((inventory) => mapInventory(inventory)),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getInventoryById = async (id: string) => {
    try {
        const inventory = await prisma.inventory.findUnique({
            where: { id },
            include: inventoryInclude,
        });

        if (!inventory) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapInventory(inventory);
    } catch (error) {
        throw error;
    }
};

const getInventoryByProductId = async (productId: string) => {
    try {
        const inventory = await prisma.inventory.findUnique({
            where: { productId },
            include: inventoryInclude,
        });

        if (!inventory) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapInventory(inventory);
    } catch (error) {
        throw error;
    }
};

const updateInventory = async (id: string, payload: UpdateInventoryPayload, userId?: string) => {
    try {
        validateInventoryPayload(payload, true);

        const existingInventory = await prisma.inventory.findUnique({
            where: { id },
            include: inventoryInclude,
        });

        if (!existingInventory) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const nextProductId = payload.productId?.trim() || existingInventory.productId;
        const product = payload.productId
            ? await ensureInventoryProductExists(nextProductId)
            : existingInventory.product;
        const quantity = typeof payload.quantity !== "undefined" ? Number(payload.quantity) : existingInventory.quantity;
        const lowStockThreshold = typeof payload.lowStockThreshold !== "undefined"
            ? Number(payload.lowStockThreshold)
            : existingInventory.lowStockThreshold;
        const reservedQuantity = typeof payload.reservedQuantity !== "undefined"
            ? Number(payload.reservedQuantity)
            : existingInventory.reservedQuantity;
        const quantityDifference = quantity - existingInventory.quantity;

        if (reservedQuantity > quantity) {
            throw new AppError(400, "Reserved quantity cannot be greater than inventory quantity");
        }

        if (payload.productId && payload.productId !== existingInventory.productId) {
            const targetInventory = await prisma.inventory.findUnique({
                where: { productId: nextProductId },
                select: { id: true },
            });

            if (targetInventory) {
                throw new AppError(409, "Inventory already exists for this product");
            }
        }

        const inventory = await prisma.$transaction(async (tx) => {
            const updatedInventory = await tx.inventory.update({
                where: { id },
                data: {
                    ...(typeof payload.productId !== "undefined" ? { productId: nextProductId } : {}),
                    ...(typeof payload.quantity !== "undefined" ? { quantity } : {}),
                    ...(typeof payload.lowStockThreshold !== "undefined" ? { lowStockThreshold } : {}),
                    ...(typeof payload.reservedQuantity !== "undefined" ? { reservedQuantity } : {}),
                },
                include: inventoryInclude,
            });

            await syncProductInventorySnapshot(tx, nextProductId, quantity, lowStockThreshold);

            if (payload.productId && payload.productId !== existingInventory.productId) {
                await syncProductInventorySnapshot(
                    tx,
                    existingInventory.productId,
                    existingInventory.product.stock,
                    existingInventory.product.lowStockThreshold,
                );
            }

            if (quantityDifference !== 0) {
                await tx.inventoryLog.create({
                    data: {
                        productId: nextProductId,
                        productName: product.name,
                        type: quantityDifference > 0 ? "INCREASE" : "DECREASE",
                        quantity: Math.abs(quantityDifference),
                        note: payload.note?.trim() || "Inventory updated",
                        createdById: userId || null,
                    },
                });
            }

            return updatedInventory;
        });

        return mapInventory(inventory);
    } catch (error) {
        throw error;
    }
};

const adjustInventory = async (productId: string, payload: AdjustInventoryPayload, userId?: string) => {
    try {
        const { type, quantity } = validateAdjustInventoryPayload(payload);

        const existingInventory = await prisma.inventory.findUnique({
            where: { productId },
            include: inventoryInclude,
        });

        if (!existingInventory) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const nextQuantity = calculateAdjustedQuantity(existingInventory.quantity, type, quantity);

        if (existingInventory.reservedQuantity > nextQuantity) {
            throw new AppError(400, "Reserved quantity cannot be greater than inventory quantity");
        }

        const inventory = await prisma.$transaction(async (tx) => {
            const updatedInventory = await tx.inventory.update({
                where: { productId },
                data: {
                    quantity: nextQuantity,
                },
                include: inventoryInclude,
            });

            await syncProductInventorySnapshot(
                tx,
                productId,
                nextQuantity,
                existingInventory.lowStockThreshold,
            );

            await tx.inventoryLog.create({
                data: {
                    productId,
                    productName: existingInventory.product.name,
                    type,
                    quantity,
                    note: payload.note?.trim() || null,
                    createdById: userId || null,
                },
            });

            return updatedInventory;
        });

        return mapInventory(inventory);
    } catch (error) {
        throw error;
    }
};

const getInventoryLogs = async (productId?: string) => {
    try {
        const logs = await prisma.inventoryLog.findMany({
            where: productId ? { productId } : {},
            orderBy: [
                { createdAt: "desc" },
            ],
            take: 100,
        });

        return {
            items: logs.map((log) => mapInventoryLog(log)),
            total: logs.length,
        };
    } catch (error) {
        throw error;
    }
};

const deleteInventory = async (id: string) => {
    try {
        const existingInventory = await prisma.inventory.findUnique({
            where: { id },
            include: inventoryInclude,
        });

        if (!existingInventory) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const deletedInventory = await prisma.$transaction(async (tx) => {
            const deleted = await tx.inventory.delete({
                where: { id },
            });

            await syncProductInventorySnapshot(tx, existingInventory.productId, 0, existingInventory.lowStockThreshold);

            return deleted;
        });

        return {
            id: deletedInventory.id,
            productId: deletedInventory.productId,
        };
    } catch (error) {
        throw error;
    }
};

export const InventoryService = {
    createInventory,
    getInventories,
    getInventoryById,
    getInventoryByProductId,
    updateInventory,
    adjustInventory,
    getInventoryLogs,
    deleteInventory,
};
