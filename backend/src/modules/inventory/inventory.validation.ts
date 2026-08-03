import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { calculateStockStatus } from "../product/product.validation";
import type {
    AdjustInventoryPayload,
    CreateInventoryPayload,
    InventoryItem,
    InventoryListFilters,
    InventoryLogItem,
    InventoryLogType,
    StockStatus,
    UpdateInventoryPayload,
} from "./inventory.interface";

type InventoryRecord = {
    id: string;
    productId: string;
    quantity: number;
    lowStockThreshold: number;
    reservedQuantity: number;
    createdAt: Date;
    updatedAt: Date;
    product: {
        id: string;
        name: string;
        slug: string;
        sku: string;
        stock: number;
        lowStockThreshold: number;
        stockStatus: StockStatus;
    };
};

type InventoryLogRecord = {
    id: string;
    productId: string;
    productName: string;
    type: InventoryLogType;
    quantity: number;
    note: string | null;
    createdById: string | null;
    createdAt: Date;
};

const stockStatuses: StockStatus[] = ["AVAILABLE", "LOW_STOCK", "OUT_OF_STOCK", "COMING_SOON"];
const inventoryLogTypes: InventoryLogType[] = ["INCREASE", "DECREASE", "ADJUSTMENT"];

export const inventoryInclude = {
    product: {
        select: {
            id: true,
            name: true,
            slug: true,
            sku: true,
            stock: true,
            lowStockThreshold: true,
            stockStatus: true,
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

export const parseStockStatus = (value: unknown): StockStatus | undefined => {
    const status = getQueryValue(value)?.toUpperCase() as StockStatus | undefined;
    return status && stockStatuses.includes(status) ? status : undefined;
};

export const parseInventoryLogType = (value: unknown): InventoryLogType | undefined => {
    const type = String(value || "").toUpperCase() as InventoryLogType;
    return inventoryLogTypes.includes(type) ? type : undefined;
};

export const parseNumber = (value: unknown): number | undefined => {
    const parsed = Number(getQueryValue(value));
    return Number.isFinite(parsed) ? parsed : undefined;
};

export const mapInventory = (inventory: InventoryRecord): InventoryItem => ({
    id: inventory.id,
    productId: inventory.productId,
    quantity: inventory.quantity,
    lowStockThreshold: inventory.lowStockThreshold,
    reservedQuantity: inventory.reservedQuantity,
    availableQuantity: Math.max(inventory.quantity - inventory.reservedQuantity, 0),
    stockStatus: inventory.product.stockStatus,
    createdAt: inventory.createdAt,
    updatedAt: inventory.updatedAt,
    product: inventory.product,
});

export const mapInventoryLog = (log: InventoryLogRecord): InventoryLogItem => ({
    id: log.id,
    productId: log.productId,
    productName: log.productName,
    type: log.type,
    quantity: log.quantity,
    note: log.note,
    createdById: log.createdById,
    createdAt: log.createdAt,
});

export const buildInventoryWhereClause = (filters: InventoryListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.productId) {
        where.productId = filters.productId;
    }

    if (filters.stockStatus) {
        where.product = {
            stockStatus: filters.stockStatus,
        };
    }

    return where;
};

export const ensureInventoryProductExists = async (productId: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                id: true,
                name: true,
                stock: true,
                lowStockThreshold: true,
                stockStatus: true,
            },
        });

        if (!product) {
            throw new AppError(404, "Product not found");
        }

        return product;
    } catch (error) {
        throw error;
    }
};

export const validateInventoryPayload = (
    payload: CreateInventoryPayload | UpdateInventoryPayload,
    isUpdate = false,
) => {
    const productId = payload.productId?.trim();

    if (!isUpdate && !productId) {
        throw new AppError(400, "Product id is required");
    }

    if (typeof payload.quantity !== "undefined" && (!Number.isInteger(Number(payload.quantity)) || Number(payload.quantity) < 0)) {
        throw new AppError(400, "Valid inventory quantity is required");
    }

    if (
        typeof payload.lowStockThreshold !== "undefined"
        && (!Number.isInteger(Number(payload.lowStockThreshold)) || Number(payload.lowStockThreshold) < 0)
    ) {
        throw new AppError(400, "Valid low stock threshold is required");
    }

    if (
        typeof payload.reservedQuantity !== "undefined"
        && (!Number.isInteger(Number(payload.reservedQuantity)) || Number(payload.reservedQuantity) < 0)
    ) {
        throw new AppError(400, "Valid reserved quantity is required");
    }
};

export const validateAdjustInventoryPayload = (payload: AdjustInventoryPayload) => {
    const type = parseInventoryLogType(payload.type);
    const quantity = Number(payload.quantity);

    if (!type) {
        throw new AppError(400, "Valid inventory adjustment type is required");
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
        throw new AppError(400, "Valid inventory adjustment quantity is required");
    }

    return { type, quantity };
};

export const calculateAdjustedQuantity = (currentQuantity: number, type: InventoryLogType, quantity: number) => {
    if (type === "INCREASE") {
        return currentQuantity + quantity;
    }

    if (type === "DECREASE") {
        const nextQuantity = currentQuantity - quantity;
        if (nextQuantity < 0) {
            throw new AppError(400, "Inventory quantity cannot be negative");
        }

        return nextQuantity;
    }

    return quantity;
};

export const syncProductInventorySnapshot = async (
    tx: any,
    productId: string,
    quantity: number,
    lowStockThreshold: number,
    requestedStatus?: StockStatus,
) => {
    try {
        const stockStatus = calculateStockStatus(quantity, lowStockThreshold, requestedStatus);

        await tx.product.update({
            where: { id: productId },
            data: {
                stock: quantity,
                lowStockThreshold,
                stockStatus,
            },
        });

        return stockStatus;
    } catch (error) {
        throw error;
    }
};
