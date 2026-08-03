export type SeoTargetType = "product" | "category" | "brand";

export type SeoItem = {
    id: string;
    metaTitle: string | null;
    metaDescription: string | null;
    keywords: string | null;
    canonical: string | null;
    ogImage: string | null;
    robots: string | null;
    jsonLd: unknown;
    createdAt: Date;
    updatedAt: Date;
};

export type SeoListFilters = {
    search?: string;
    page?: number;
    limit?: number;
};

export type CreateSeoPayload = {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    canonical?: string;
    ogImage?: string;
    robots?: string;
    jsonLd?: unknown;
    targetType?: SeoTargetType;
    targetId?: string;
};

export type UpdateSeoPayload = Partial<CreateSeoPayload>;

export type AttachSeoPayload = {
    targetType: SeoTargetType;
    targetId: string;
};
