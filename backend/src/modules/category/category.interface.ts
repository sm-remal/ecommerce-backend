export type CategoryStatus = "ACTIVE" | "DRAFT" | "HIDDEN";

export type CategorySummary = {
    id: string;
    name: string;
    slug: string;
};

export type CategoryItem = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    sortOrder: number;
    status: CategoryStatus;
    metaTitle: string | null;
    metaDescription: string | null;
    createdAt: Date;
    updatedAt: Date;
    parent: CategorySummary | null;
    children: CategoryItem[];
};

export type CategoryListFilters = {
    search?: string;
    status?: CategoryStatus;
    parentId?: string;
    flat?: boolean;
    page?: number;
    limit?: number;
};

export type CreateCategoryPayload = {
    name: string;
    slug?: string;
    description?: string;
    image?: string;
    parentId?: string | null;
    sortOrder?: number;
    status?: CategoryStatus;
    metaTitle?: string;
    metaDescription?: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export type CategoryListResponse = {
    items: CategoryItem[];
    tree: CategoryItem[];
    total: number;
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPage: number;
    };
};
