export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type StockStatus = "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK" | "COMING_SOON";

export type DiscountType = "PERCENTAGE" | "FIXED";

export type ProductSortBy = "newest" | "oldest" | "price_low" | "price_high" | "name_asc" | "name_desc";

export type ProductImagePayload = {
    url: string;
    altText?: string;
    isThumbnail?: boolean;
    sortOrder?: number;
};

export type ProductImageItem = {
    id: string;
    url: string;
    altText: string | null;
    isThumbnail: boolean;
    sortOrder: number;
};

export type ProductTagItem = {
    id: string;
    name: string;
    slug: string;
};

export type ProductSummary = {
    id: string;
    name: string;
    slug: string;
};

export type CatalogSummary = ProductSummary & {
    image?: string | null;
    logo?: string | null;
};

export type ProductItem = {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    shortDescription: string | null;
    categoryId: string;
    brandId: string | null;
    price: number;
    salePrice: number | null;
    costPrice: number | null;
    discountType: DiscountType | null;
    discountValue: number | null;
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
    category: CatalogSummary;
    brand: CatalogSummary | null;
    images: ProductImageItem[];
    thumbnail: ProductImageItem | null;
    tags: ProductTagItem[];
};

export type ProductListFilters = {
    search?: string;
    categoryId?: string;
    brandId?: string;
    tag?: string;
    status?: ProductStatus;
    stockStatus?: StockStatus;
    isFeatured?: boolean;
    isTrending?: boolean;
    isNewArrival?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: ProductSortBy;
    page?: number;
    limit?: number;
};

export type ProductListResponse = {
    items: ProductItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPage: number;
    };
};

export type CreateProductPayload = {
    name: string;
    slug?: string;
    sku: string;
    description?: string;
    shortDescription?: string;
    categoryId: string;
    brandId?: string | null;
    price: number;
    salePrice?: number | null;
    costPrice?: number | null;
    discountType?: DiscountType | null;
    discountValue?: number | null;
    discountStartAt?: string | Date | null;
    discountEndAt?: string | Date | null;
    stock?: number;
    lowStockThreshold?: number;
    stockStatus?: StockStatus;
    status?: ProductStatus;
    isFeatured?: boolean;
    isTrending?: boolean;
    isNewArrival?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    images?: ProductImagePayload[];
    tags?: string[];
};

export type UpdateProductPayload = Partial<CreateProductPayload>;
