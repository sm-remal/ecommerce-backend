import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import {
    buildBannerWhereClause,
    buildCreateBannerData,
    buildUpdateBannerData,
    mapBanner,
    validateBannerPayload,
} from "./banner.validation";
import { responseMessages } from "../../utility/responseMessages";
import type { BannerListFilters, CreateBannerPayload, UpdateBannerPayload } from "./banner.interface";

const createBanner = async (payload: CreateBannerPayload) => {
    try {
        validateBannerPayload(payload);

        const banner = await prisma.banner.create({
            data: buildCreateBannerData(payload),
        });

        return mapBanner(banner);
    } catch (error) {
        throw error;
    }
};

const getBanners = async (filters: BannerListFilters = {}) => {
    try {
        const where = buildBannerWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);
        const [banners, total] = await Promise.all([
            prisma.banner.findMany({
                where,
                orderBy: [
                    { sortOrder: "asc" },
                    { createdAt: "desc" },
                ],
                skip,
                take: limit,
            }),
            prisma.banner.count({ where }),
        ]);

        return {
            items: banners.map((banner) => mapBanner(banner)),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getBannerById = async (id: string) => {
    try {
        const banner = await prisma.banner.findUnique({
            where: { id },
        });

        if (!banner) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapBanner(banner);
    } catch (error) {
        throw error;
    }
};

const updateBanner = async (id: string, payload: UpdateBannerPayload) => {
    try {
        validateBannerPayload(payload, true);

        const existingBanner = await prisma.banner.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existingBanner) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const banner = await prisma.banner.update({
            where: { id },
            data: buildUpdateBannerData(payload),
        });

        return mapBanner(banner);
    } catch (error) {
        throw error;
    }
};

const deleteBanner = async (id: string) => {
    try {
        const existingBanner = await prisma.banner.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
            },
        });

        if (!existingBanner) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const deletedBanner = await prisma.banner.delete({
            where: { id },
        });

        return {
            id: deletedBanner.id,
            title: deletedBanner.title,
        };
    } catch (error) {
        throw error;
    }
};

export const BannerService = {
    createBanner,
    getBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
};
