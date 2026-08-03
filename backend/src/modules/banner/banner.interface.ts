export type BannerPosition = "HERO" | "PROMO" | "SIDEBAR";

export type BannerItem = {
    id: string;
    title: string;
    subtitle: string | null;
    image: string;
    buttonText: string | null;
    buttonLink: string | null;
    position: BannerPosition;
    sortOrder: number;
    isActive: boolean;
    startAt: Date | null;
    expiryAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export type BannerListFilters = {
    search?: string;
    position?: BannerPosition;
    isActive?: boolean;
    activeNow?: boolean;
    page?: number;
    limit?: number;
};

export type CreateBannerPayload = {
    title: string;
    subtitle?: string;
    image: string;
    buttonText?: string;
    buttonLink?: string;
    position?: BannerPosition;
    sortOrder?: number;
    isActive?: boolean;
    startAt?: string | Date | null;
    expiryAt?: string | Date | null;
};

export type UpdateBannerPayload = Partial<CreateBannerPayload>;
