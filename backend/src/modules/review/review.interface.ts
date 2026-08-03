export type ReviewProductSummary = {
    id: string;
    name: string;
    slug: string;
    sku: string;
};

export type ReviewItem = {
    id: string;
    productId: string;
    customerName: string;
    email: string | null;
    rating: number;
    comment: string | null;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    product: ReviewProductSummary;
};

export type ReviewStats = {
    productId: string;
    averageRating: number;
    totalReviews: number;
};

export type ReviewListFilters = {
    search?: string;
    productId?: string;
    status?: boolean;
    rating?: number;
    page?: number;
    limit?: number;
};

export type CreateReviewPayload = {
    productId: string;
    customerName: string;
    email?: string;
    rating: number;
    comment?: string;
    status?: boolean;
};

export type UpdateReviewPayload = Partial<CreateReviewPayload>;

export type UpdateReviewStatusPayload = {
    status: boolean;
};
