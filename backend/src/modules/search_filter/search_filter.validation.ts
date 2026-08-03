import { z } from "zod";
import { AppError } from "../../utility/AppError";
import type { SearchFilterQuery } from "./search_filter.interface";

const productStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
const stockStatuses = ["AVAILABLE", "LOW_STOCK", "OUT_OF_STOCK", "COMING_SOON"] as const;
const sortValues = ["newest", "oldest", "price_low", "price_high", "name_asc", "name_desc", "discount"] as const;

const searchFilterQuerySchema = z.object({
    search: z.string().trim().optional(),
    categoryId: z.string().trim().optional(),
    categorySlug: z.string().trim().optional(),
    brandId: z.string().trim().optional(),
    brandSlug: z.string().trim().optional(),
    tag: z.string().trim().optional(),
    status: z.enum(productStatuses).optional(),
    stockStatus: z.enum(stockStatuses).optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    hasDiscount: z.coerce.boolean().optional(),
    isFeatured: z.coerce.boolean().optional(),
    isTrending: z.coerce.boolean().optional(),
    isNewArrival: z.coerce.boolean().optional(),
    sortBy: z.enum(sortValues).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
}).superRefine((query, context) => {
    if (
        typeof query.minPrice !== "undefined"
        && typeof query.maxPrice !== "undefined"
        && query.maxPrice < query.minPrice
    ) {
        context.addIssue({
            code: "custom",
            message: "Max price must be greater than min price",
            path: ["maxPrice"],
        });
    }
});

const suggestionQuerySchema = z.object({
    search: z.string().trim().optional(),
    limit: z.coerce.number().int().positive().max(20).optional(),
});

const formatZodMessage = (error: z.ZodError) => error.issues.map((issue) => issue.message).join(", ");

export const parseSearchFilterQuery = (query: unknown): SearchFilterQuery => {
    try {
        const parsed = searchFilterQuerySchema.parse(query);

        return {
            ...(parsed.search ? { search: parsed.search } : {}),
            ...(parsed.categoryId ? { categoryId: parsed.categoryId } : {}),
            ...(parsed.categorySlug ? { categorySlug: parsed.categorySlug } : {}),
            ...(parsed.brandId ? { brandId: parsed.brandId } : {}),
            ...(parsed.brandSlug ? { brandSlug: parsed.brandSlug } : {}),
            ...(parsed.tag ? { tag: parsed.tag } : {}),
            ...(parsed.status ? { status: parsed.status } : {}),
            ...(parsed.stockStatus ? { stockStatus: parsed.stockStatus } : {}),
            ...(typeof parsed.minPrice !== "undefined" ? { minPrice: parsed.minPrice } : {}),
            ...(typeof parsed.maxPrice !== "undefined" ? { maxPrice: parsed.maxPrice } : {}),
            ...(typeof parsed.hasDiscount !== "undefined" ? { hasDiscount: parsed.hasDiscount } : {}),
            ...(typeof parsed.isFeatured !== "undefined" ? { isFeatured: parsed.isFeatured } : {}),
            ...(typeof parsed.isTrending !== "undefined" ? { isTrending: parsed.isTrending } : {}),
            ...(typeof parsed.isNewArrival !== "undefined" ? { isNewArrival: parsed.isNewArrival } : {}),
            ...(parsed.sortBy ? { sortBy: parsed.sortBy } : {}),
            ...(typeof parsed.page !== "undefined" ? { page: parsed.page } : {}),
            ...(typeof parsed.limit !== "undefined" ? { limit: parsed.limit } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseSuggestionQuery = (query: unknown) => {
    try {
        const parsed = suggestionQuerySchema.parse(query);

        return {
            ...(parsed.search ? { search: parsed.search } : {}),
            limit: parsed.limit || 10,
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};
