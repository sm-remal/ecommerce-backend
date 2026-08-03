import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import { AppError } from "../../utility/AppError";
import slugify from "../../utility/slugify";
import type {
    CreateProductPayload,
    ProductImagePayload,
    ProductItem,
    ProductListFilters,
    ProductSortBy,
    ProductStatus,
    StockStatus,
    UpdateProductPayload,
} from "./product.interface";

export const productInclude: Prisma.ProductInclude = {
    category: {
        select: {
            id: true,
            name: true,
            slug: true,
            image: true,
        },
    },
    brand: {
        select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
        },
    },
    images: {
        orderBy: [
            { isThumbnail: "desc" },
            { sortOrder: "asc" },
        ],
    },
    tags: {
        include: {
            tag: true,
        },
    },
};

type ProductRecord = {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    shortDescription: string | null;
    categoryId: string;
    brandId: string | null;
    price: unknown;
    salePrice: unknown | null;
    costPrice: unknown | null;
    discountType: string | null;
    discountValue: unknown | null;
    discountStartAt: Date | null;
    discountEndAt: Date | null;
    stock: number;
    lowStockThreshold: number;
    stockStatus: StockStatus;
    status: ProductStatus;
    isFeatured: boolean;
    isTrending: boolean;
    isNewArrival: boolean;
    viewCount: number;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    createdAt: Date;
    updatedAt: Date;
    category: {
        id: string;
        name: string;
        slug: string;
        image: string | null;
    };
    brand: {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
    } | null;
    images: {
        id: string;
        url: string;
        altText: string | null;
        isThumbnail: boolean;
        sortOrder: number;
    }[];
    tags: {
        tag: {
            id: string;
            name: string;
            slug: string;
        };
    }[];
};

const productStatuses: ProductStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const stockStatuses: StockStatus[] = ["AVAILABLE", "LOW_STOCK", "OUT_OF_STOCK", "COMING_SOON"];
const discountTypes = ["PERCENTAGE", "FIXED"] as const;
const sortValues: ProductSortBy[] = ["newest", "oldest", "price_low", "price_high", "name_asc", "name_desc"];

export const getQueryValue = (value: unknown) => {
    if (Array.isArray(value)) {
        const firstValue = value[0];
        return typeof firstValue === "string" ? firstValue : undefined;
    }

    return typeof value === "string" ? value : undefined;
};

export const parseProductStatus = (value: unknown): ProductStatus | undefined => {
    const status = getQueryValue(value)?.toUpperCase() as ProductStatus | undefined;
    return status && productStatuses.includes(status) ? status : undefined;
};

export const parseStockStatus = (value: unknown): StockStatus | undefined => {
    const status = getQueryValue(value)?.toUpperCase() as StockStatus | undefined;
    return status && stockStatuses.includes(status) ? status : undefined;
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

export const parseNumber = (value: unknown): number | undefined => {
    const parsed = Number(getQueryValue(value));
    return Number.isFinite(parsed) ? parsed : undefined;
};

export const parseSortBy = (value: unknown): ProductSortBy | undefined => {
    const sortBy = getQueryValue(value) as ProductSortBy | undefined;
    return sortBy && sortValues.includes(sortBy) ? sortBy : undefined;
};

export const parseDateValue = (value: unknown) => {
    if (value === null || typeof value === "undefined" || value === "") {
        return null;
    }

    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) {
        throw new AppError(400, "Invalid date provided");
    }

    return date;
};

export const calculateStockStatus = (
    stock: number,
    lowStockThreshold: number,
    requestedStatus?: StockStatus,
): StockStatus => {
    if (requestedStatus === "COMING_SOON") {
        return "COMING_SOON";
    }

    if (stock <= 0) {
        return "OUT_OF_STOCK";
    }

    if (stock <= lowStockThreshold) {
        return "LOW_STOCK";
    }

    return "AVAILABLE";
};

export const buildProductWhereClause = (filters: ProductListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }

    if (filters.brandId) {
        where.brandId = filters.brandId;
    }

    if (filters.stockStatus) {
        where.stockStatus = filters.stockStatus;
    }

    if (typeof filters.isFeatured !== "undefined") {
        where.isFeatured = filters.isFeatured;
    }

    if (typeof filters.isTrending !== "undefined") {
        where.isTrending = filters.isTrending;
    }

    if (typeof filters.isNewArrival !== "undefined") {
        where.isNewArrival = filters.isNewArrival;
    }

    if (filters.tag) {
        where.tags = {
            some: {
                tag: {
                    slug: slugify(filters.tag),
                },
            },
        };
    }

    if (typeof filters.minPrice !== "undefined" || typeof filters.maxPrice !== "undefined") {
        where.price = {
            ...(typeof filters.minPrice !== "undefined" ? { gte: filters.minPrice } : {}),
            ...(typeof filters.maxPrice !== "undefined" ? { lte: filters.maxPrice } : {}),
        };
    }

    if (filters.search?.trim()) {
        const search = filters.search.trim();
        where.OR = [
            { name: { contains: search } },
            { slug: { contains: search } },
            { sku: { contains: search } },
            { description: { contains: search } },
            { shortDescription: { contains: search } },
        ];
    }

    return where;
};

export const buildProductOrderBy = (sortBy?: ProductSortBy): Prisma.ProductOrderByWithRelationInput[] => {
    switch (sortBy) {
        case "oldest":
            return [{ createdAt: "asc" }];
        case "price_low":
            return [{ price: "asc" }];
        case "price_high":
            return [{ price: "desc" }];
        case "name_asc":
            return [{ name: "asc" }];
        case "name_desc":
            return [{ name: "desc" }];
        case "newest":
        default:
            return [{ createdAt: "desc" }];
    }
};

export const buildPagination = (filters: ProductListFilters) => {
    const page = Math.max(Number(filters.page || 1), 1);
    const limit = Math.min(Math.max(Number(filters.limit || 10), 1), 100);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

export const normalizeProductImages = (images?: ProductImagePayload[]) => {
    if (!Array.isArray(images)) {
        return [];
    }

    const normalized = images
        .map((image, index) => ({
            url: image.url?.trim(),
            altText: image.altText?.trim() || null,
            isThumbnail: Boolean(image.isThumbnail),
            sortOrder: Number.isFinite(image.sortOrder) ? Number(image.sortOrder) : index,
        }))
        .filter((image) => Boolean(image.url));

    if (normalized.length > 0 && !normalized.some((image) => image.isThumbnail)) {
        normalized[0] = { ...normalized[0]!, isThumbnail: true };
    }

    return normalized;
};

export const normalizeTagNames = (tags?: string[]) => {
    if (!Array.isArray(tags)) {
        return [];
    }

    return Array.from(
        new Set(
            tags
                .map((tag) => tag.trim())
                .filter(Boolean),
        ),
    );
};

export const mapProduct = (product: any): ProductItem => {
    const images = product.images.map((image: ProductRecord["images"][number]) => ({
        id: image.id,
        url: image.url,
        altText: image.altText,
        isThumbnail: image.isThumbnail,
        sortOrder: image.sortOrder,
    }));

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        description: product.description,
        shortDescription: product.shortDescription,
        categoryId: product.categoryId,
        brandId: product.brandId,
        price: Number(product.price),
        salePrice: product.salePrice === null ? null : Number(product.salePrice),
        costPrice: product.costPrice === null ? null : Number(product.costPrice),
        discountType: product.discountType as ProductItem["discountType"],
        discountValue: product.discountValue === null ? null : Number(product.discountValue),
        discountStartAt: product.discountStartAt,
        discountEndAt: product.discountEndAt,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        stockStatus: product.stockStatus,
        status: product.status,
        isFeatured: product.isFeatured,
        isTrending: product.isTrending,
        isNewArrival: product.isNewArrival,
        viewCount: product.viewCount,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        metaKeywords: product.metaKeywords,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        category: product.category,
        brand: product.brand,
        images,
        thumbnail: images.find((image: ProductRecord["images"][number]) => image.isThumbnail) || images[0] || null,
        tags: product.tags.map(({ tag }: ProductRecord["tags"][number]) => tag),
    };
};

export const generateUniqueProductSlug = async (baseValue: string, excludeId?: string) => {
    try {
        const baseSlug = slugify(baseValue);

        if (!baseSlug) {
            throw new AppError(400, "Product name is required");
        }

        let candidate = baseSlug;
        let suffix = 2;

        while (true) {
            const existing = await prisma.product.findUnique({
                where: { slug: candidate },
                select: { id: true },
            });

            if (!existing || existing.id === excludeId) {
                return candidate;
            }

            candidate = `${baseSlug}-${suffix}`;
            suffix += 1;
        }
    } catch (error) {
        throw error;
    }
};

export const ensureProductCategoryExists = async (categoryId: string) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            select: { id: true },
        });

        if (!category) {
            throw new AppError(404, "Category not found");
        }
    } catch (error) {
        throw error;
    }
};

export const ensureProductBrandExists = async (brandId?: string | null) => {
    try {
        if (!brandId) {
            return;
        }

        const brand = await prisma.brand.findUnique({
            where: { id: brandId },
            select: { id: true },
        });

        if (!brand) {
            throw new AppError(404, "Brand not found");
        }
    } catch (error) {
        throw error;
    }
};

export const ensureProductSkuIsUnique = async (sku: string, excludeId?: string) => {
    try {
        const existing = await prisma.product.findUnique({
            where: { sku },
            select: { id: true },
        });

        if (existing && existing.id !== excludeId) {
            throw new AppError(409, "Product SKU already exists");
        }
    } catch (error) {
        throw error;
    }
};

export const syncProductImages = async (tx: any, productId: string, images?: CreateProductPayload["images"]) => {
    try {
        if (typeof images === "undefined") {
            return;
        }

        await tx.productImage.deleteMany({
            where: { productId },
        });

        const normalizedImages = normalizeProductImages(images);
        if (normalizedImages.length > 0) {
            await tx.productImage.createMany({
                data: normalizedImages.map((image) => ({
                    productId,
                    ...image,
                })),
            });
        }
    } catch (error) {
        throw error;
    }
};

export const syncProductTags = async (tx: any, productId: string, tags?: string[]) => {
    try {
        if (typeof tags === "undefined") {
            return;
        }

        await tx.productTag.deleteMany({
            where: { productId },
        });

        const tagNames = normalizeTagNames(tags);

        for (const tagName of tagNames) {
            const tag = await tx.tag.upsert({
                where: { slug: slugify(tagName) },
                update: { name: tagName },
                create: {
                    name: tagName,
                    slug: slugify(tagName),
                },
            });

            await tx.productTag.create({
                data: {
                    productId,
                    tagId: tag.id,
                },
            });
        }
    } catch (error) {
        throw error;
    }
};

export const validateProductPayload = (payload: CreateProductPayload | UpdateProductPayload, isUpdate = false) => {
    const name = payload.name?.trim();
    const sku = payload.sku?.trim();
    const price = Number(payload.price);

    if (!isUpdate && !name) {
        throw new AppError(400, "Product name is required");
    }

    if (!isUpdate && !sku) {
        throw new AppError(400, "Product SKU is required");
    }

    if (!isUpdate && !payload.categoryId) {
        throw new AppError(400, "Product category is required");
    }

    if ((!isUpdate || typeof payload.price !== "undefined") && (!Number.isFinite(price) || price < 0)) {
        throw new AppError(400, "Valid product price is required");
    }

    if (payload.discountType && !discountTypes.includes(payload.discountType)) {
        throw new AppError(400, "Invalid discount type");
    }
};
