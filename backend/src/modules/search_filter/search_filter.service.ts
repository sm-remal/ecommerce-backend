import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import {
    buildProductOrderBy,
    mapProduct,
    productInclude,
} from "../product/product.validation";
import slugify from "../../utility/slugify";
import type {
    SearchFilterOptions,
    SearchFilterQuery,
    SearchFilterResult,
    SearchSuggestion,
} from "./search_filter.interface";

const defaultPublicStatus = "PUBLISHED";

const buildSearchPagination = (filters: SearchFilterQuery) => {
    const page = Math.max(Number(filters.page || 1), 1);
    const limit = Math.min(Math.max(Number(filters.limit || 10), 1), 100);

    return {
        page,
        limit,
        skip: (page - 1) * limit,
    };
};

const buildSearchFilterWhereClause = async (filters: SearchFilterQuery): Promise<Prisma.ProductWhereInput> => {
    try {
        const where: Prisma.ProductWhereInput = {
            status: filters.status || defaultPublicStatus,
        };

        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters.categorySlug) {
            where.category = { slug: filters.categorySlug };
        }

        if (filters.brandId) {
            where.brandId = filters.brandId;
        }

        if (filters.brandSlug) {
            where.brand = { slug: filters.brandSlug };
        }

        if (filters.stockStatus) {
            where.stockStatus = filters.stockStatus;
        }

        if (typeof filters.isFeatured !== "undefined") {
            where.isFeatured = filters.isFeatured;
        }

        if (typeof filters.isTrending !== "undefined") {
            where.isTrending = filters.isTrending;
        }

        if (typeof filters.isNewArrival !== "undefined") {
            where.isNewArrival = filters.isNewArrival;
        }

        if (filters.tag) {
            where.tags = {
                some: {
                    tag: {
                        slug: slugify(filters.tag),
                    },
                },
            };
        }

        if (typeof filters.minPrice !== "undefined" || typeof filters.maxPrice !== "undefined") {
            where.price = {
                ...(typeof filters.minPrice !== "undefined" ? { gte: filters.minPrice } : {}),
                ...(typeof filters.maxPrice !== "undefined" ? { lte: filters.maxPrice } : {}),
            };
        }

        if (filters.hasDiscount) {
            where.OR = [
                { salePrice: { not: null } },
                { discountValue: { not: null } },
                {
                    discountProducts: {
                        some: {
                            discount: {
                                status: true,
                                startDate: { lte: new Date() },
                                endDate: { gte: new Date() },
                            },
                        },
                    },
                },
            ];
        }

        if (filters.search?.trim()) {
            const search = filters.search.trim();
            const searchConditions: Prisma.ProductWhereInput[] = [
                { name: { contains: search } },
                { slug: { contains: search } },
                { sku: { contains: search } },
                { description: { contains: search } },
                { shortDescription: { contains: search } },
                { category: { name: { contains: search } } },
                { brand: { name: { contains: search } } },
                {
                    tags: {
                        some: {
                            tag: {
                                name: { contains: search },
                            },
                        },
                    },
                },
            ];

            where.AND = [
                ...(Array.isArray(where.AND) ? where.AND : []),
                { OR: searchConditions },
            ];
        }

        return where;
    } catch (error) {
        throw error;
    }
};

const getProductOrderBy = (sortBy: SearchFilterQuery["sortBy"]): Prisma.ProductOrderByWithRelationInput[] => {
    if (sortBy === "discount") {
        return [
            { discountValue: "desc" },
            { salePrice: "asc" },
            { createdAt: "desc" },
        ];
    }

    return buildProductOrderBy(sortBy);
};

const searchProducts = async (filters: SearchFilterQuery = {}): Promise<SearchFilterResult> => {
    try {
        const where = await buildSearchFilterWhereClause(filters);
        const { page, limit, skip } = buildSearchPagination(filters);

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy: getProductOrderBy(filters.sortBy),
                skip,
                take: limit,
                include: productInclude,
            }),
            prisma.product.count({ where }),
        ]);

        return {
            items: products.map((product) => mapProduct(product)),
            meta: {
                total,
                page,
                limit,
                totalPage: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        throw error;
    }
};

const getSearchSuggestions = async (query: { search?: string; limit: number }): Promise<SearchSuggestion[]> => {
    try {
        const search = query.search?.trim();
        const productLimit = Math.max(Math.ceil(query.limit / 2), 1);
        const catalogLimit = Math.max(Math.floor(query.limit / 3), 1);
        const searchWhere = search ? { contains: search } : undefined;

        const [products, categories, brands, tags] = await Promise.all([
            prisma.product.findMany({
                where: {
                    status: defaultPublicStatus,
                    ...(searchWhere ? {
                        OR: [
                            { name: searchWhere },
                            { sku: searchWhere },
                            { slug: searchWhere },
                        ],
                    } : {}),
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    images: {
                        where: { isThumbnail: true },
                        select: { url: true },
                        take: 1,
                    },
                },
                orderBy: { viewCount: "desc" },
                take: productLimit,
            }),
            prisma.category.findMany({
                where: {
                    status: "ACTIVE",
                    ...(searchWhere ? { name: searchWhere } : {}),
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    image: true,
                },
                orderBy: { sortOrder: "asc" },
                take: catalogLimit,
            }),
            prisma.brand.findMany({
                where: {
                    status: "ACTIVE",
                    ...(searchWhere ? { name: searchWhere } : {}),
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    logo: true,
                },
                orderBy: { name: "asc" },
                take: catalogLimit,
            }),
            prisma.tag.findMany({
                where: searchWhere ? { name: searchWhere } : {},
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
                orderBy: { name: "asc" },
                take: catalogLimit,
            }),
        ]);

        return [
            ...products.map((product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                type: "PRODUCT" as const,
                image: product.images[0]?.url || null,
            })),
            ...categories.map((category) => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                type: "CATEGORY" as const,
                image: category.image,
            })),
            ...brands.map((brand) => ({
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                type: "BRAND" as const,
                image: brand.logo,
            })),
            ...tags.map((tag) => ({
                id: tag.id,
                name: tag.name,
                slug: tag.slug,
                type: "TAG" as const,
                image: null,
            })),
        ].slice(0, query.limit);
    } catch (error) {
        throw error;
    }
};

const getFilterOptions = async (): Promise<SearchFilterOptions> => {
    try {
        const [categories, brands, tags, priceRange] = await Promise.all([
            prisma.category.findMany({
                where: { status: "ACTIVE" },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    image: true,
                    _count: {
                        select: {
                            products: {
                                where: { status: defaultPublicStatus },
                            },
                        },
                    },
                },
                orderBy: [
                    { sortOrder: "asc" },
                    { name: "asc" },
                ],
            }),
            prisma.brand.findMany({
                where: { status: "ACTIVE" },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    logo: true,
                    _count: {
                        select: {
                            products: {
                                where: { status: defaultPublicStatus },
                            },
                        },
                    },
                },
                orderBy: { name: "asc" },
            }),
            prisma.tag.findMany({
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    _count: {
                        select: { products: true },
                    },
                },
                orderBy: { name: "asc" },
            }),
            prisma.product.aggregate({
                where: { status: defaultPublicStatus },
                _min: { price: true },
                _max: { price: true },
            }),
        ]);

        return {
            categories: categories.map((category) => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                image: category.image,
                productCount: category._count.products,
            })),
            brands: brands.map((brand) => ({
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                logo: brand.logo,
                productCount: brand._count.products,
            })),
            tags: tags.map((tag) => ({
                id: tag.id,
                name: tag.name,
                slug: tag.slug,
                productCount: tag._count.products,
            })),
            priceRange: {
                min: Number(priceRange._min.price || 0),
                max: Number(priceRange._max.price || 0),
            },
            stockStatuses: ["AVAILABLE", "LOW_STOCK", "OUT_OF_STOCK", "COMING_SOON"],
            sortOptions: [
                { label: "Newest", value: "newest" },
                { label: "Oldest", value: "oldest" },
                { label: "Price low to high", value: "price_low" },
                { label: "Price high to low", value: "price_high" },
                { label: "A-Z", value: "name_asc" },
                { label: "Z-A", value: "name_desc" },
                { label: "Discount", value: "discount" },
            ],
        };
    } catch (error) {
        throw error;
    }
};

export const SearchFilterService = {
    searchProducts,
    getSearchSuggestions,
    getFilterOptions,
};
