import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import {
    buildBrandWhereClause,
    generateUniqueBrandSlug,
    mapBrand,
    validateBrandPayload,
} from "./brand.validation";
import { responseMessages } from "../../utility/responseMessages";
import type { BrandListFilters, CreateBrandPayload, UpdateBrandPayload } from "./brand.interface";

const createBrand = async (payload: CreateBrandPayload) => {
    try {
        validateBrandPayload(payload);

        const name = payload.name.trim();
        const slug = await generateUniqueBrandSlug(payload.slug?.trim() || name);

        const brand = await prisma.brand.create({
            data: {
                name,
                slug,
                logo: payload.logo?.trim() || null,
                description: payload.description?.trim() || null,
                status: payload.status ?? "ACTIVE",
            },
        });

        return mapBrand(brand);
    } catch (error) {
        throw error;
    }
};

const getBrands = async (filters: BrandListFilters = {}) => {
    try {
        const where = buildBrandWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);
        const [brands, total] = await Promise.all([
            prisma.brand.findMany({
                where,
                orderBy: [
                    { name: "asc" },
                ],
                skip,
                take: limit,
            }),
            prisma.brand.count({ where }),
        ]);

        return {
            items: brands.map((brand) => mapBrand(brand)),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getBrandById = async (id: string) => {
    try {
        const brand = await prisma.brand.findUnique({
            where: { id },
        });

        if (!brand) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapBrand(brand);
    } catch (error) {
        throw error;
    }
};

const getBrandBySlug = async (slug: string) => {
    try {
        const brand = await prisma.brand.findUnique({
            where: { slug },
        });

        if (!brand) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapBrand(brand);
    } catch (error) {
        throw error;
    }
};

const updateBrand = async (id: string, payload: UpdateBrandPayload) => {
    try {
        validateBrandPayload(payload, true);

        const existingBrand = await prisma.brand.findUnique({
            where: { id },
            select: {
                id: true,
                slug: true,
            },
        });

        if (!existingBrand) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const nextName = payload.name?.trim();
        const nextSlugSource = payload.slug?.trim() || nextName || existingBrand.slug;
        const slug = await generateUniqueBrandSlug(nextSlugSource, id);

        const brand = await prisma.brand.update({
            where: { id },
            data: {
                ...(nextName ? { name: nextName } : {}),
                slug,
                ...(typeof payload.logo !== "undefined" ? { logo: payload.logo?.trim() || null } : {}),
                ...(typeof payload.description !== "undefined" ? { description: payload.description?.trim() || null } : {}),
                ...(typeof payload.status !== "undefined" ? { status: payload.status } : {}),
            },
        });

        return mapBrand(brand);
    } catch (error) {
        throw error;
    }
};

const deleteBrand = async (id: string) => {
    try {
        const existingBrand = await prisma.brand.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });

        if (!existingBrand) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const productCount = await prisma.product.count({
            where: { brandId: id },
        });

        if (productCount > 0) {
            throw new AppError(409, "Brand cannot be deleted because products are linked to it");
        }

        const deletedBrand = await prisma.brand.delete({
            where: { id },
        });

        return {
            id: deletedBrand.id,
            name: deletedBrand.name,
        };
    } catch (error) {
        throw error;
    }
};

export const BrandService = {
    createBrand,
    getBrands,
    getBrandById,
    getBrandBySlug,
    updateBrand,
    deleteBrand,
};
