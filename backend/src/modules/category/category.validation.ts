import { z } from "zod";

const categoryStatuses = ["ACTIVE", "DRAFT", "HIDDEN"] as const;

const categoryBaseSchema = z.object({
    name: z.string().trim().min(1).max(120),
    slug: z.string().trim().min(1).max(160).optional(),
    description: z.string().trim().optional(),
    image: z.string().trim().optional(),
    parentId: z.union([z.string().trim().min(1), z.null()]).optional(),
    sortOrder: z.coerce.number().int().nonnegative().optional(),
    status: z.enum(categoryStatuses).optional(),
    metaTitle: z.string().trim().optional(),
    metaDescription: z.string().trim().optional(),
});

export const createCategorySchema = categoryBaseSchema;

export const updateCategorySchema = categoryBaseSchema.partial();
