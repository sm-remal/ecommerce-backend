export type ProductImageItem = {
    id: string;
    productId: string;
    url: string;
    altText: string | null;
    isThumbnail: boolean;
    sortOrder: number;
    product: {
        id: string;
        name: string;
        slug: string;
    };
};

export type ProductImageListFilters = {
    productId?: string;
    isThumbnail?: boolean;
    page?: number;
    limit?: number;
};

export type CreateProductImagePayload = {
    productId: string;
    url: string;
    altText?: string;
    isThumbnail?: boolean;
    sortOrder?: number;
};

export type UpdateProductImagePayload = Partial<Omit<CreateProductImagePayload, "productId">> & {
    productId?: string;
};
