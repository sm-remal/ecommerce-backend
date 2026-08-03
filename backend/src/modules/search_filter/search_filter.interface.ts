import type { ProductItem, ProductSortBy, ProductStatus, StockStatus } from "../product/product.interface";

export type SearchFilterQuery = {
    search?: string;
    categoryId?: string;
    categorySlug?: string;
    brandId?: string;
    brandSlug?: string;
    tag?: string;
    status?: ProductStatus;
    stockStatus?: StockStatus;
    minPrice?: number;
    maxPrice?: number;
    hasDiscount?: boolean;
    isFeatured?: boolean;
    isTrending?: boolean;
    isNewArrival?: boolean;
    sortBy?: ProductSortBy | "discount";
    page?: number;
    limit?: number;
};

export type SearchFilterResult = {
    items: ProductItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPage: number;
    };
};

export type SearchSuggestion = {
    id: string;
    name: string;
    slug: string;
    type: "PRODUCT" | "CATEGORY" | "BRAND" | "TAG";
    image: string | null;
};

export type SearchFilterOptions = {
    categories: Array<{
        id: string;
        name: string;
        slug: string;
        image: string | null;
        productCount: number;
    }>;
    brands: Array<{
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        productCount: number;
    }>;
    tags: Array<{
        id: string;
        name: string;
        slug: string;
        productCount: number;
    }>;
    priceRange: {
        min: number;
        max: number;
    };
    stockStatuses: StockStatus[];
    sortOptions: Array<{
        label: string;
        value: SearchFilterQuery["sortBy"];
    }>;
};
