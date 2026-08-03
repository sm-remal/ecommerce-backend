export type DiscountType = "PERCENTAGE" | "FIXED";

export type DiscountProductSummary = {
    id: string;
    name: string;
    slug: string;
    sku: string;
};

export type DiscountCategorySummary = {
    id: string;
    name: string;
    slug: string;
};

export type DiscountItem = {
    id: string;
    name: string;
    type: DiscountType;
    value: number;
    startDate: Date;
    endDate: Date;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    products: DiscountProductSummary[];
    categories: DiscountCategorySummary[];
};

export type DiscountListFilters = {
    search?: string;
    type?: DiscountType;
    status?: boolean;
    activeNow?: boolean;
    productId?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
};

export type CreateDiscountPayload = {
    name: string;
    type: DiscountType;
    value: number;
    startDate: string | Date;
    endDate: string | Date;
    status?: boolean;
    productIds?: string[];
    categoryIds?: string[];
};

export type UpdateDiscountPayload = Partial<CreateDiscountPayload>;

export type SyncDiscountTargetsPayload = {
    productIds?: string[];
    categoryIds?: string[];
};
