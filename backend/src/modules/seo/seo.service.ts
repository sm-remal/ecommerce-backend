import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import {
    attachSeoToTarget,
    buildSeoData,
    buildSeoWhereClause,
    ensureSeoExists,
    mapSeo,
    validateAttachSeoPayload,
    validateSeoPayload,
} from "./seo.validation";
import { responseMessages } from "../../utility/responseMessages";
import type { AttachSeoPayload, CreateSeoPayload, SeoListFilters, SeoTargetType, UpdateSeoPayload } from "./seo.interface";

const createSeo = async (payload: CreateSeoPayload) => {
    try {
        validateSeoPayload(payload);

        const seo = await prisma.$transaction(async (tx) => {
            const createdSeo = await tx.seo.create({
                data: buildSeoData(payload),
            });

            if (payload.targetType && payload.targetId) {
                await attachSeoToTarget(tx, createdSeo.id, payload.targetType, payload.targetId);
            }

            return createdSeo;
        });

        return mapSeo(seo);
    } catch (error) {
        throw error;
    }
};

const getSeoList = async (filters: SeoListFilters = {}) => {
    try {
        const where = buildSeoWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);
        const [seoList, total] = await Promise.all([
            prisma.seo.findMany({
                where,
                orderBy: [
                    { updatedAt: "desc" },
                ],
                skip,
                take: limit,
            }),
            prisma.seo.count({ where }),
        ]);

        return {
            items: seoList.map((seo) => mapSeo(seo)),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getSeoById = async (id: string) => {
    try {
        const seo = await prisma.seo.findUnique({
            where: { id },
        });

        if (!seo) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapSeo(seo);
    } catch (error) {
        throw error;
    }
};

const updateSeo = async (id: string, payload: UpdateSeoPayload) => {
    try {
        validateSeoPayload(payload);
        await ensureSeoExists(id);

        const seo = await prisma.$transaction(async (tx) => {
            const updatedSeo = await tx.seo.update({
                where: { id },
                data: buildSeoData(payload, true),
            });

            if (payload.targetType && payload.targetId) {
                await attachSeoToTarget(tx, updatedSeo.id, payload.targetType, payload.targetId);
            }

            return updatedSeo;
        });

        return mapSeo(seo);
    } catch (error) {
        throw error;
    }
};

const attachSeo = async (id: string, payload: AttachSeoPayload) => {
    try {
        validateAttachSeoPayload(payload);
        await ensureSeoExists(id);

        await prisma.$transaction(async (tx) => {
            await attachSeoToTarget(tx, id, payload.targetType, payload.targetId);
        });

        return getSeoById(id);
    } catch (error) {
        throw error;
    }
};

const getSeoByTarget = async (targetType: SeoTargetType, targetId: string) => {
    try {
        if (targetType === "product") {
            const product = await prisma.product.findUnique({
                where: { id: targetId },
                select: { seo: true },
            });

            if (!product?.seo) {
                throw new AppError(404, responseMessages.common.notFound);
            }

            return mapSeo(product.seo);
        }

        if (targetType === "category") {
            const category = await prisma.category.findUnique({
                where: { id: targetId },
                select: { seo: true },
            });

            if (!category?.seo) {
                throw new AppError(404, responseMessages.common.notFound);
            }

            return mapSeo(category.seo);
        }

        const brand = await prisma.brand.findUnique({
            where: { id: targetId },
            select: { seo: true },
        });

        if (!brand?.seo) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapSeo(brand.seo);
    } catch (error) {
        throw error;
    }
};

const unlinkSeoFromTarget = async (targetType: SeoTargetType, targetId: string) => {
    try {
        await prisma.$transaction(async (tx) => {
            await attachSeoToTarget(tx, null, targetType, targetId);
        });

        return {
            targetType,
            targetId,
        };
    } catch (error) {
        throw error;
    }
};

const deleteSeo = async (id: string) => {
    try {
        await ensureSeoExists(id);

        const deletedSeo = await prisma.seo.delete({
            where: { id },
        });

        return {
            id: deletedSeo.id,
            metaTitle: deletedSeo.metaTitle,
        };
    } catch (error) {
        throw error;
    }
};

export const SeoService = {
    createSeo,
    getSeoList,
    getSeoById,
    updateSeo,
    attachSeo,
    getSeoByTarget,
    unlinkSeoFromTarget,
    deleteSeo,
};
