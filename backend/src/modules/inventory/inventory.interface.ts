export type InventoryLogType = "INCREASE" | "DECREASE" | "ADJUSTMENT";

export type StockStatus = "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK" | "COMING_SOON";

export type InventoryItem = {
    id: string;
    productId: string;
    quantity: number;
    lowStockThreshold: number;
    reservedQuantity: number;
    availableQuantity: number;
    stockStatus: StockStatus;
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

export type InventoryLogItem = {
    id: string;
    productId: string;
    productName: string;
    type: InventoryLogType;
    quantity: number;
    note: string | null;
    createdById: string | null;
    createdAt: Date;
};

export type InventoryListFilters = {
    productId?: string;
    stockStatus?: StockStatus;
    page?: number;
    limit?: number;
};

export type CreateInventoryPayload = {
    productId: string;
    quantity?: number;
    lowStockThreshold?: number;
    reservedQuantity?: number;
    note?: string;
};

export type UpdateInventoryPayload = Partial<Omit<CreateInventoryPayload, "productId">> & {
    productId?: string;
};

export type AdjustInventoryPayload = {
    type: InventoryLogType;
    quantity: number;
    note?: string;
};
