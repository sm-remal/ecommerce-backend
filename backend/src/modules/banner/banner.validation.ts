import { AppError } from "../../utility/AppError";
import type {
    BannerItem,
    BannerListFilters,
    BannerPosition,
    CreateBannerPayload,
    UpdateBannerPayload,
} from "./banner.interface";

type BannerRecord = {
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

const bannerPositions: BannerPosition[] = ["HERO", "PROMO", "SIDEBAR"];

export const getQueryValue = (value: unknown) => {
    if (Array.isArray(value)) {
        const firstValue = value[0];
        return typeof firstValue === "string" ? firstValue : undefined;
    }

    return typeof value === "string" ? value : undefined;
};

export const parseBannerPosition = (value: unknown): BannerPosition | undefined => {
    const position = getQueryValue(value)?.toUpperCase() as BannerPosition | undefined;
    return position && bannerPositions.includes(position) ? position : undefined;
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

export const parseDateValue = (value: unknown) => {
    if (value === null || typeof value === "undefined" || value === "") {
        return null;
    }

    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) {
        throw new AppError(400, "Invalid banner date provided");
    }

    return date;
};

export const mapBanner = (banner: BannerRecord): BannerItem => ({
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    image: banner.image,
    buttonText: banner.buttonText,
    buttonLink: banner.buttonLink,
    position: banner.position,
    sortOrder: banner.sortOrder,
    isActive: banner.isActive,
    startAt: banner.startAt,
    expiryAt: banner.expiryAt,
    createdAt: banner.createdAt,
    updatedAt: banner.updatedAt,
});

export const buildBannerWhereClause = (filters: BannerListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.position) {
        where.position = filters.position;
    }

    if (typeof filters.isActive !== "undefined") {
        where.isActive = filters.isActive;
    }

    if (filters.activeNow) {
        const now = new Date();
        where.isActive = true;
        where.AND = [
            {
                OR: [
                    { startAt: null },
                    { startAt: { lte: now } },
                ],
            },
            {
                OR: [
                    { expiryAt: null },
                    { expiryAt: { gte: now } },
                ],
            },
        ];
    }

    if (filters.search?.trim()) {
        const search = filters.search.trim();
        where.OR = [
            { title: { contains: search } },
            { subtitle: { contains: search } },
            { buttonText: { contains: search } },
            { buttonLink: { contains: search } },
        ];
    }

    return where;
};

export const validateBannerPayload = (payload: CreateBannerPayload | UpdateBannerPayload, isUpdate = false) => {
    const title = payload.title?.trim();
    const image = payload.image?.trim();

    if (!isUpdate && !title) {
        throw new AppError(400, "Banner title is required");
    }

    if (!isUpdate && !image) {
        throw new AppError(400, "Banner image is required");
    }

    if (isUpdate && typeof payload.image !== "undefined" && !image) {
        throw new AppError(400, "Banner image cannot be empty");
    }

    if (payload.position && !bannerPositions.includes(payload.position)) {
        throw new AppError(400, "Invalid banner position");
    }

    if (typeof payload.sortOrder !== "undefined" && !Number.isFinite(Number(payload.sortOrder))) {
        throw new AppError(400, "Valid banner sort order is required");
    }

    const startAt = parseDateValue(payload.startAt);
    const expiryAt = parseDateValue(payload.expiryAt);

    if (startAt && expiryAt && expiryAt < startAt) {
        throw new AppError(400, "Banner expiry date must be after start date");
    }
};

export const buildCreateBannerData = (payload: CreateBannerPayload) => ({
    title: payload.title.trim(),
    subtitle: payload.subtitle?.trim() || null,
    image: payload.image.trim(),
    buttonText: payload.buttonText?.trim() || null,
    buttonLink: payload.buttonLink?.trim() || null,
    position: payload.position ?? "HERO",
    sortOrder: Number.isFinite(payload.sortOrder) ? Number(payload.sortOrder) : 0,
    isActive: typeof payload.isActive === "undefined" ? true : payload.isActive,
    startAt: parseDateValue(payload.startAt),
    expiryAt: parseDateValue(payload.expiryAt),
});

export const buildUpdateBannerData = (payload: UpdateBannerPayload) => ({
    ...(typeof payload.title !== "undefined" ? { title: payload.title.trim() } : {}),
    ...(typeof payload.subtitle !== "undefined" ? { subtitle: payload.subtitle?.trim() || null } : {}),
    ...(typeof payload.image !== "undefined" ? { image: payload.image.trim() } : {}),
    ...(typeof payload.buttonText !== "undefined" ? { buttonText: payload.buttonText?.trim() || null } : {}),
    ...(typeof payload.buttonLink !== "undefined" ? { buttonLink: payload.buttonLink?.trim() || null } : {}),
    ...(typeof payload.position !== "undefined" ? { position: payload.position } : {}),
    ...(typeof payload.sortOrder !== "undefined" ? { sortOrder: Number(payload.sortOrder) } : {}),
    ...(typeof payload.isActive !== "undefined" ? { isActive: payload.isActive } : {}),
    ...(typeof payload.startAt !== "undefined" ? { startAt: parseDateValue(payload.startAt) } : {}),
    ...(typeof payload.expiryAt !== "undefined" ? { expiryAt: parseDateValue(payload.expiryAt) } : {}),
});
