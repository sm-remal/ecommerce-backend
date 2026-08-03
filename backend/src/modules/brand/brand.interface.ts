export type BrandStatus = "ACTIVE" | "DRAFT" | "HIDDEN";

export type BrandItem = {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    description: string | null;
    status: BrandStatus;
    createdAt: Date;
    updatedAt: Date;
};

export type BrandListFilters = {
    search?: string;
    status?: BrandStatus;
    page?: number;
    limit?: number;
};

export type CreateBrandPayload = {
    name: string;
    slug?: string;
    logo?: string;
    description?: string;
    status?: BrandStatus;
};

export type UpdateBrandPayload = Partial<CreateBrandPayload>;
