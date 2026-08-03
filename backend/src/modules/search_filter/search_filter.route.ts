import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { SearchFilterController } from "./search_filter.controller";
import { parseSearchFilterQuery, parseSuggestionQuery } from "./search_filter.validation";

const router = Router();

router.get("/products", validateRequest({ query: parseSearchFilterQuery }), SearchFilterController.searchProducts);
router.get("/suggestions", validateRequest({ query: parseSuggestionQuery }), SearchFilterController.getSearchSuggestions);
router.get("/filters", SearchFilterController.getFilterOptions);

export const SearchFilterRoutes = router;
