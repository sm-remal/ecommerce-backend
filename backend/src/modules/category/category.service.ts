import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import slugify from "../../utility/slugify";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import { responseMessages } from "../../utility/responseMessages";
import type {
    CategoryItem,
    CategoryListFilters,
    CategoryListResponse,
    CategoryStatus,
    CreateCategoryPayload,
    UpdateCategoryPayload,
} from "./category.interface";

type CategoryRecordBase = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    sortOrder: number;
    status: CategoryStatus;
    metaTitle: string | null;
    metaDescription: string | null;
    createdAt: Date;
    updatedAt: Date;
    parent: {
        id: string;
        name: string;
        slug: string;
    } | null;
};

type CategoryRecordWithChildren = CategoryRecordBase & {
    children: CategoryRecordBase[];
};

const categoryInclude = {
    parent: {
        select: {
            id: true,
            name: true,
            slug: true,
        },
    },
} as const;

const mapCategory = (category: CategoryRecordBase, children: CategoryItem[] = []): CategoryItem => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    parentId: category.parentId,
    sortOrder: category.sortOrder,
    status: category.status,
    metaTitle: category.metaTitle,
    metaDescription: category.metaDescription,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    parent: category.parent,
    children,
});

const buildCategoryTree = (items: CategoryItem[]) => {
    const itemMap = new Map<string, CategoryItem>();
    const roots: CategoryItem[] = [];

    items.forEach((item) => {
        itemMap.set(item.id, { ...item, children: [] });
    });

    itemMap.forEach((item) => {
        if (item.parentId && itemMap.has(item.parentId)) {
            itemMap.get(item.parentId)?.children.push(item);
            return;
        }

        roots.push(item);
    });

    return roots;
};

const normalizeStatus = (status?: string): CategoryStatus | undefined => {
    if (!status) {
        return undefined;
    }

    const normalized = status.toUpperCase() as CategoryStatus;
    return ["ACTIVE", "DRAFT", "HIDDEN"].includes(normalized) ? normalized : undefined;
};

const buildWhereClause = (filters: CategoryListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.status) {
        where.status = filters.status;
    }

    if (typeof filters.parentId !== "undefined") {
        where.parentId = filters.parentId;
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

const generateUniqueSlug = async (baseValue: string, excludeId?: string) => {
    try {
        const baseSlug = slugify(baseValue);

        if (!baseSlug) {
            throw new AppError(400, "Category name is required");
        }

        let candidate = baseSlug;
        let suffix = 2;

        while (true) {
            const existing = await prisma.category.findUnique({
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

const ensureParentExists = async (parentId?: string | null, currentId?: string) => {
    try {
        if (typeof parentId === "undefined" || parentId === null) {
            return;
        }

        if (parentId === currentId) {
            throw new AppError(400, "Category cannot be its own parent");
        }

        const parent = await prisma.category.findUnique({
            where: { id: parentId },
            select: { id: true },
        });

        if (!parent) {
            throw new AppError(404, "Parent category not found");
        }
    } catch (error) {
        throw error;
    }
};

const getCategories = async (filters: CategoryListFilters = {}): Promise<CategoryListResponse> => {
    try {
        const where = buildWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);
        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                where,
                orderBy: [
                    { sortOrder: "asc" },
                    { name: "asc" },
                ],
                skip,
                take: limit,
                include: categoryInclude,
            }),
            prisma.category.count({ where }),
        ]);

        const items = categories.map((category) => mapCategory(category));

        return {
            items,
            tree: filters.flat ? items : buildCategoryTree(items),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getCategoryById = async (id: string) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                parent: categoryInclude.parent,
                children: {
                    orderBy: [
                        { sortOrder: "asc" },
                        { name: "asc" },
                    ],
                    include: {
                        parent: categoryInclude.parent,
                    },
                },
            },
        });

        if (!category) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const typedCategory = category as CategoryRecordWithChildren;
        return mapCategory(typedCategory, typedCategory.children.map((child) => mapCategory(child)));
    } catch (error) {
        throw error;
    }
};

const getCategoryBySlug = async (slug: string) => {
    try {
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                parent: categoryInclude.parent,
                children: {
                    orderBy: [
                        { sortOrder: "asc" },
                        { name: "asc" },
                    ],
                    include: {
                        parent: categoryInclude.parent,
                    },
                },
            },
        });

        if (!category) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const typedCategory = category as CategoryRecordWithChildren;
        return mapCategory(typedCategory, typedCategory.children.map((child) => mapCategory(child)));
    } catch (error) {
        throw error;
    }
};

const createCategory = async (payload: CreateCategoryPayload) => {
    try {
        const name = payload.name?.trim();

        if (!name) {
            throw new AppError(400, "Category name is required");
        }

        const status = payload.status ?? "ACTIVE";
        const parentId = typeof payload.parentId === "undefined" ? null : payload.parentId;
        await ensureParentExists(parentId);

        const slugSource = payload.slug?.trim() || name;
        const slug = await generateUniqueSlug(slugSource);

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description: payload.description?.trim() || null,
                image: payload.image?.trim() || null,
                parentId,
                sortOrder: Number.isFinite(payload.sortOrder) ? Number(payload.sortOrder) : 0,
                status,
                metaTitle: payload.metaTitle?.trim() || null,
                metaDescription: payload.metaDescription?.trim() || null,
            },
            include: categoryInclude,
        });

        return mapCategory(category);
    } catch (error) {
        throw error;
    }
};

const updateCategory = async (id: string, payload: UpdateCategoryPayload) => {
    try {
        const existingCategory = await prisma.category.findUnique({
            where: { id },
            select: { id: true, slug: true },
        });

        if (!existingCategory) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        if (typeof payload.parentId !== "undefined") {
            await ensureParentExists(payload.parentId, id);
        }

        const nextName = payload.name?.trim();
        const nextSlugSource = payload.slug?.trim() || nextName || existingCategory.slug;
        const slug = await generateUniqueSlug(nextSlugSource, id);

        const category = await prisma.category.update({
            where: { id },
            data: {
                ...(nextName ? { name: nextName } : {}),
                slug,
                ...(typeof payload.description !== "undefined" ? { description: payload.description?.trim() || null } : {}),
                ...(typeof payload.image !== "undefined" ? { image: payload.image?.trim() || null } : {}),
                ...(typeof payload.parentId !== "undefined" ? { parentId: payload.parentId } : {}),
                ...(typeof payload.sortOrder !== "undefined" ? { sortOrder: Number(payload.sortOrder) } : {}),
                ...(typeof payload.status !== "undefined" ? { status: payload.status } : {}),
                ...(typeof payload.metaTitle !== "undefined" ? { metaTitle: payload.metaTitle?.trim() || null } : {}),
                ...(typeof payload.metaDescription !== "undefined" ? { metaDescription: payload.metaDescription?.trim() || null } : {}),
            },
            include: categoryInclude,
        });

        return mapCategory(category);
    } catch (error) {
        throw error;
    }
};

const deleteCategory = async (id: string) => {
    try {
        const existingCategory = await prisma.category.findUnique({
            where: { id },
            select: { id: true, name: true },
        });

        if (!existingCategory) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const productCount = await prisma.product.count({
            where: { categoryId: id },
        });

        if (productCount > 0) {
            throw new AppError(409, "Category cannot be deleted because products are linked to it");
        }

        const deletedCategory = await prisma.category.delete({
            where: { id },
        });

        return {
            id: deletedCategory.id,
            name: deletedCategory.name,
        };
    } catch (error) {
        throw error;
    }
};

export const CategoryService = {
    createCategory,
    getCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
};
