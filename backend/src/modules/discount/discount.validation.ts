import { AppError } from "../../utility/AppError";
import type {
    CreateDiscountPayload,
    DiscountItem,
    DiscountListFilters,
    DiscountType,
    SyncDiscountTargetsPayload,
    UpdateDiscountPayload,
} from "./discount.interface";

type DiscountRecord = {
    id: string;
    name: string;
    type: DiscountType;
    value: unknown;
    startDate: Date;
    endDate: Date;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    products: {
        product: {
            id: string;
            name: string;
            slug: string;
            sku: string;
        };
    }[];
    categories: {
        category: {
            id: string;
            name: string;
            slug: string;
        };
    }[];
};

const discountTypes: DiscountType[] = ["PERCENTAGE", "FIXED"];

export const discountInclude = {
    products: {
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    sku: true,
                },
            },
        },
    },
    categories: {
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
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

export const parseDiscountType = (value: unknown): DiscountType | undefined => {
    const type = getQueryValue(value)?.toUpperCase() as DiscountType | undefined;
    return type && discountTypes.includes(type) ? type : undefined;
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

export const parseDateValue = (value: unknown) => {
    const date = value instanceof Date ? value : new Date(String(value));
    if (!value || Number.isNaN(date.getTime())) {
        throw new AppError(400, "Valid discount date is required");
    }

    return date;
};

export const normalizeIds = (ids?: string[]) => {
    if (!Array.isArray(ids)) {
        return [];
    }

    return Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean)));
};

export const mapDiscount = (discount: DiscountRecord | any): DiscountItem => ({
    id: discount.id,
    name: discount.name,
    type: discount.type,
    value: Number(discount.value),
    startDate: discount.startDate,
    endDate: discount.endDate,
    status: discount.status,
    createdAt: discount.createdAt,
    updatedAt: discount.updatedAt,
    products: discount.products.map(({ product }: DiscountRecord["products"][number]) => product),
    categories: discount.categories.map(({ category }: DiscountRecord["categories"][number]) => category),
});

export const buildDiscountWhereClause = (filters: DiscountListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.type) {
        where.type = filters.type;
    }

    if (typeof filters.status !== "undefined") {
        where.status = filters.status;
    }

    if (filters.activeNow) {
        const now = new Date();
        where.status = true;
        where.startDate = { lte: now };
        where.endDate = { gte: now };
    }

    if (filters.productId) {
        where.products = {
            some: {
                productId: filters.productId,
            },
        };
    }

    if (filters.categoryId) {
        where.categories = {
            some: {
                categoryId: filters.categoryId,
            },
        };
    }

    if (filters.search?.trim()) {
        const search = filters.search.trim();
        where.OR = [
            { name: { contains: search } },
        ];
    }

    return where;
};

export const validateDiscountPayload = (payload: CreateDiscountPayload | UpdateDiscountPayload, isUpdate = false) => {
    const name = payload.name?.trim();
    const value = Number(payload.value);

    if (!isUpdate && !name) {
        throw new AppError(400, "Discount name is required");
    }

    if ((!isUpdate || typeof payload.type !== "undefined") && (!payload.type || !discountTypes.includes(payload.type))) {
        throw new AppError(400, "Valid discount type is required");
    }

    if ((!isUpdate || typeof payload.value !== "undefined") && (!Number.isFinite(value) || value <= 0)) {
        throw new AppError(400, "Valid discount value is required");
    }

    if (payload.type === "PERCENTAGE" && value > 100) {
        throw new AppError(400, "Percentage discount cannot be greater than 100");
    }

    if (!isUpdate || typeof payload.startDate !== "undefined" || typeof payload.endDate !== "undefined") {
        const startDate = typeof payload.startDate === "undefined" ? undefined : parseDateValue(payload.startDate);
        const endDate = typeof payload.endDate === "undefined" ? undefined : parseDateValue(payload.endDate);

        if (!isUpdate && (!startDate || !endDate)) {
            throw new AppError(400, "Discount start and end date are required");
        }

        if (startDate && endDate && endDate < startDate) {
            throw new AppError(400, "Discount end date must be after start date");
        }
    }
};

export const validateSyncDiscountTargetsPayload = (payload: SyncDiscountTargetsPayload) => {
    if (typeof payload.productIds !== "undefined" && !Array.isArray(payload.productIds)) {
        throw new AppError(400, "Product ids must be an array");
    }

    if (typeof payload.categoryIds !== "undefined" && !Array.isArray(payload.categoryIds)) {
        throw new AppError(400, "Category ids must be an array");
    }
};

export const buildCreateDiscountData = (payload: CreateDiscountPayload) => ({
    name: payload.name.trim(),
    type: payload.type,
    value: Number(payload.value),
    startDate: parseDateValue(payload.startDate),
    endDate: parseDateValue(payload.endDate),
    status: typeof payload.status === "undefined" ? true : payload.status,
});

export const buildUpdateDiscountData = (payload: UpdateDiscountPayload) => ({
    ...(typeof payload.name !== "undefined" ? { name: payload.name.trim() } : {}),
    ...(typeof payload.type !== "undefined" ? { type: payload.type } : {}),
    ...(typeof payload.value !== "undefined" ? { value: Number(payload.value) } : {}),
    ...(typeof payload.startDate !== "undefined" ? { startDate: parseDateValue(payload.startDate) } : {}),
    ...(typeof payload.endDate !== "undefined" ? { endDate: parseDateValue(payload.endDate) } : {}),
    ...(typeof payload.status !== "undefined" ? { status: payload.status } : {}),
});
