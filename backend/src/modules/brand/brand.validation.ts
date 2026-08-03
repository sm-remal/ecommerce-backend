import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import slugify from "../../utility/slugify";
import type { BrandItem, BrandListFilters, BrandStatus, CreateBrandPayload, UpdateBrandPayload } from "./brand.interface";

type BrandRecord = {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    description: string | null;
    status: BrandStatus;
    createdAt: Date;
    updatedAt: Date;
};

const brandStatuses: BrandStatus[] = ["ACTIVE", "DRAFT", "HIDDEN"];

export const getQueryValue = (value: unknown) => {
    if (Array.isArray(value)) {
        const firstValue = value[0];
        return typeof firstValue === "string" ? firstValue : undefined;
    }

    return typeof value === "string" ? value : undefined;
};

export const parseBrandStatus = (value: unknown): BrandStatus | undefined => {
    const status = getQueryValue(value)?.toUpperCase() as BrandStatus | undefined;
    return status && brandStatuses.includes(status) ? status : undefined;
};

export const mapBrand = (brand: BrandRecord): BrandItem => ({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logo: brand.logo,
    description: brand.description,
    status: brand.status,
    createdAt: brand.createdAt,
    updatedAt: brand.updatedAt,
});

export const buildBrandWhereClause = (filters: BrandListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.search?.trim()) {
        const search = filters.search.trim();
        where.OR = [
            { name: { contains: search } },
            { slug: { contains: search } },
            { description: { contains: search } },
        ];
    }

    return where;
};

export const generateUniqueBrandSlug = async (baseValue: string, excludeId?: string) => {
    try {
        const baseSlug = slugify(baseValue);

        if (!baseSlug) {
            throw new AppError(400, "Brand name is required");
        }

        let candidate = baseSlug;
        let suffix = 2;

        while (true) {
            const existing = await prisma.brand.findUnique({
                where: { slug: candidate },
                select: { id: true },
            });

            if (!existing || existing.id === excludeId) {
                return candidate;
            }

            candidate = `${baseSlug}-${suffix}`;
            suffix += 1;
        }
    } catch (error) {
        throw error;
    }
};

export const validateBrandPayload = (payload: CreateBrandPayload | UpdateBrandPayload, isUpdate = false) => {
    const name = payload.name?.trim();

    if (!isUpdate && !name) {
        throw new AppError(400, "Brand name is required");
    }

    if (payload.status && !brandStatuses.includes(payload.status)) {
        throw new AppError(400, "Invalid brand status");
    }
};
