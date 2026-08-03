export type WishlistProductSummary = {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    salePrice: number | null;
    stockStatus: string;
    thumbnail: string | null;
};

export type WishlistItem = {
    id: string;
    userId: string;
    productId: string;
    createdAt: Date;
    product: WishlistProductSummary;
};

export type WishlistListFilters = {
    search?: string;
    page?: number;
    limit?: number;
};

export type CreateWishlistPayload = {
    productId: string;
};
