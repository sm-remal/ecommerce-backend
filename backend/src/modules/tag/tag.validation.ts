import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import slugify from "../../utility/slugify";
import type { CreateTagPayload, TagItem, TagListFilters, UpdateTagPayload } from "./tag.interface";

type TagRecord = {
    id: string;
    name: string;
    slug: string;
};

export const getQueryValue = (value: unknown) => {
    if (Array.isArray(value)) {
        const firstValue = value[0];
        return typeof firstValue === "string" ? firstValue : undefined;
    }

    return typeof value === "string" ? value : undefined;
};

export const mapTag = (tag: TagRecord): TagItem => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
});

export const buildTagWhereClause = (filters: TagListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.search?.trim()) {
        const search = filters.search.trim();
        where.OR = [
            { name: { contains: search } },
            { slug: { contains: search } },
        ];
    }

    return where;
};

export const generateUniqueTagSlug = async (baseValue: string, excludeId?: string) => {
    try {
        const baseSlug = slugify(baseValue);

        if (!baseSlug) {
            throw new AppError(400, "Tag name is required");
        }

        let candidate = baseSlug;
        let suffix = 2;

        while (true) {
            const existing = await prisma.tag.findUnique({
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

export const ensureTagNameIsUnique = async (name: string, excludeId?: string) => {
    try {
        const existing = await prisma.tag.findUnique({
            where: { name },
            select: { id: true },
        });

        if (existing && existing.id !== excludeId) {
            throw new AppError(409, "Tag name already exists");
        }
    } catch (error) {
        throw error;
    }
};

export const validateTagPayload = (payload: CreateTagPayload | UpdateTagPayload, isUpdate = false) => {
    const name = payload.name?.trim();

    if (!isUpdate && !name) {
        throw new AppError(400, "Tag name is required");
    }
};
