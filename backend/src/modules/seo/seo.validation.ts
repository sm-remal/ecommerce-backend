import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import type { AttachSeoPayload, CreateSeoPayload, SeoItem, SeoListFilters, SeoTargetType, UpdateSeoPayload } from "./seo.interface";

type SeoRecord = {
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

const targetTypes: SeoTargetType[] = ["product", "category", "brand"];

export const getQueryValue = (value: unknown) => {
    if (Array.isArray(value)) {
        const firstValue = value[0];
        return typeof firstValue === "string" ? firstValue : undefined;
    }

    return typeof value === "string" ? value : undefined;
};

export const parseSeoTargetType = (value: unknown): SeoTargetType | undefined => {
    const targetType = getQueryValue(value)?.toLowerCase() as SeoTargetType | undefined;
    return targetType && targetTypes.includes(targetType) ? targetType : undefined;
};

export const mapSeo = (seo: SeoRecord): SeoItem => ({
    id: seo.id,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    keywords: seo.keywords,
    canonical: seo.canonical,
    ogImage: seo.ogImage,
    robots: seo.robots,
    jsonLd: seo.jsonLd,
    createdAt: seo.createdAt,
    updatedAt: seo.updatedAt,
});

export const buildSeoWhereClause = (filters: SeoListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.search?.trim()) {
        const search = filters.search.trim();
        where.OR = [
            { metaTitle: { contains: search } },
            { metaDescription: { contains: search } },
            { keywords: { contains: search } },
            { canonical: { contains: search } },
            { robots: { contains: search } },
        ];
    }

    return where;
};

export const validateSeoPayload = (payload: CreateSeoPayload | UpdateSeoPayload) => {
    if (payload.targetType && !targetTypes.includes(payload.targetType)) {
        throw new AppError(400, "Invalid SEO target type");
    }

    if ((payload.targetType && !payload.targetId) || (!payload.targetType && payload.targetId)) {
        throw new AppError(400, "SEO target type and target id must be provided together");
    }
};

export const validateAttachSeoPayload = (payload: AttachSeoPayload) => {
    if (!payload.targetId?.trim()) {
        throw new AppError(400, "SEO target id is required");
    }

    if (!payload.targetType || !targetTypes.includes(payload.targetType)) {
        throw new AppError(400, "Valid SEO target type is required");
    }
};

export const buildSeoData = (payload: CreateSeoPayload | UpdateSeoPayload, isUpdate = false) => ({
    ...(!isUpdate || typeof payload.metaTitle !== "undefined" ? { metaTitle: payload.metaTitle?.trim() || null } : {}),
    ...(!isUpdate || typeof payload.metaDescription !== "undefined" ? { metaDescription: payload.metaDescription?.trim() || null } : {}),
    ...(!isUpdate || typeof payload.keywords !== "undefined" ? { keywords: payload.keywords?.trim() || null } : {}),
    ...(!isUpdate || typeof payload.canonical !== "undefined" ? { canonical: payload.canonical?.trim() || null } : {}),
    ...(!isUpdate || typeof payload.ogImage !== "undefined" ? { ogImage: payload.ogImage?.trim() || null } : {}),
    ...(!isUpdate || typeof payload.robots !== "undefined" ? { robots: payload.robots?.trim() || null } : {}),
    ...(!isUpdate || typeof payload.jsonLd !== "undefined" ? { jsonLd: payload.jsonLd ?? Prisma.JsonNull } : {}),
});

export const ensureSeoExists = async (seoId: string) => {
    try {
        const seo = await prisma.seo.findUnique({
            where: { id: seoId },
            select: { id: true },
        });

        if (!seo) {
            throw new AppError(404, "SEO data not found");
        }
    } catch (error) {
        throw error;
    }
};

export const attachSeoToTarget = async (tx: any, seoId: string | null, targetType: SeoTargetType, targetId: string) => {
    try {
        if (targetType === "product") {
            const target = await tx.product.findUnique({
                where: { id: targetId },
                select: { id: true },
            });

            if (!target) {
                throw new AppError(404, "Product not found");
            }

            await tx.product.update({
                where: { id: targetId },
                data: { seoId },
            });
            return;
        }

        if (targetType === "category") {
            const target = await tx.category.findUnique({
                where: { id: targetId },
                select: { id: true },
            });

            if (!target) {
                throw new AppError(404, "Category not found");
            }

            await tx.category.update({
                where: { id: targetId },
                data: { seoId },
            });
            return;
        }

        const target = await tx.brand.findUnique({
            where: { id: targetId },
            select: { id: true },
        });

        if (!target) {
            throw new AppError(404, "Brand not found");
        }

        await tx.brand.update({
            where: { id: targetId },
            data: { seoId },
        });
    } catch (error) {
        throw error;
    }
};
