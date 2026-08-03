import assert from "node:assert/strict";
import test from "node:test";
import { buildPagination, buildPaginationMeta } from "../src/utility/pagination";

test("buildPagination applies defaults", () => {
    assert.deepEqual(buildPagination({}), {
        page: 1,
        limit: 20,
        skip: 0,
    });
});

test("buildPagination clamps invalid values", () => {
    assert.deepEqual(buildPagination({ page: -4, limit: 0 }), {
        page: 1,
        limit: 20,
        skip: 0,
    });
});

test("buildPaginationMeta calculates totals", () => {
    assert.deepEqual(buildPaginationMeta(26, 2, 10), {
        total: 26,
        page: 2,
        limit: 10,
        totalPage: 3,
    });
});
