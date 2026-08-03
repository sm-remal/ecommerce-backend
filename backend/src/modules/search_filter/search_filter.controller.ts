import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { SearchFilterService } from "./search_filter.service";
import {
    parseSearchFilterQuery,
    parseSuggestionQuery,
} from "./search_filter.validation";

const searchProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await SearchFilterService.searchProducts(parseSearchFilterQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.searchFilter.products,
        data: products,
    });
});

const getSearchSuggestions = asyncHandler(async (req: Request, res: Response) => {
    const suggestions = await SearchFilterService.getSearchSuggestions(parseSuggestionQuery(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.searchFilter.suggestions,
        data: suggestions,
    });
});

const getFilterOptions = asyncHandler(async (req: Request, res: Response) => {
    const filters = await SearchFilterService.getFilterOptions();

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.searchFilter.filters,
        data: filters,
    });
});

export const SearchFilterController = {
    searchProducts,
    getSearchSuggestions,
    getFilterOptions,
};
