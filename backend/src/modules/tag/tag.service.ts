import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import {
    buildTagWhereClause,
    ensureTagNameIsUnique,
    generateUniqueTagSlug,
    mapTag,
    validateTagPayload,
} from "./tag.validation";
import { responseMessages } from "../../utility/responseMessages";
import type { CreateTagPayload, TagListFilters, UpdateTagPayload } from "./tag.interface";

const createTag = async (payload: CreateTagPayload) => {
    try {
        validateTagPayload(payload);

        const name = payload.name.trim();
        await ensureTagNameIsUnique(name);

        const slug = await generateUniqueTagSlug(payload.slug?.trim() || name);

        const tag = await prisma.tag.create({
            data: {
                name,
                slug,
            },
        });

        return mapTag(tag);
    } catch (error) {
        throw error;
    }
};

const getTags = async (filters: TagListFilters = {}) => {
    try {
        const where = buildTagWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);
        const [tags, total] = await Promise.all([
            prisma.tag.findMany({
                where,
                orderBy: [
                    { name: "asc" },
                ],
                skip,
                take: limit,
            }),
            prisma.tag.count({ where }),
        ]);

        return {
            items: tags.map((tag) => mapTag(tag)),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getTagById = async (id: string) => {
    try {
        const tag = await prisma.tag.findUnique({
            where: { id },
        });

        if (!tag) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapTag(tag);
    } catch (error) {
        throw error;
    }
};

const getTagBySlug = async (slug: string) => {
    try {
        const tag = await prisma.tag.findUnique({
            where: { slug },
        });

        if (!tag) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapTag(tag);
    } catch (error) {
        throw error;
    }
};

const updateTag = async (id: string, payload: UpdateTagPayload) => {
    try {
        validateTagPayload(payload, true);

        const existingTag = await prisma.tag.findUnique({
            where: { id },
            select: {
                id: true,
                slug: true,
            },
        });

        if (!existingTag) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const nextName = payload.name?.trim();
        if (nextName) {
            await ensureTagNameIsUnique(nextName, id);
        }

        const nextSlugSource = payload.slug?.trim() || nextName || existingTag.slug;
        const slug = await generateUniqueTagSlug(nextSlugSource, id);

        const tag = await prisma.tag.update({
            where: { id },
            data: {
                ...(nextName ? { name: nextName } : {}),
                slug,
            },
        });

        return mapTag(tag);
    } catch (error) {
        throw error;
    }
};

const deleteTag = async (id: string) => {
    try {
        const existingTag = await prisma.tag.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });

        if (!existingTag) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const productCount = await prisma.productTag.count({
            where: { tagId: id },
        });

        if (productCount > 0) {
            throw new AppError(409, "Tag cannot be deleted because products are linked to it");
        }

        const deletedTag = await prisma.tag.delete({
            where: { id },
        });

        return {
            id: deletedTag.id,
            name: deletedTag.name,
        };
    } catch (error) {
        throw error;
    }
};

export const TagService = {
    createTag,
    getTags,
    getTagById,
    getTagBySlug,
    updateTag,
    deleteTag,
};
