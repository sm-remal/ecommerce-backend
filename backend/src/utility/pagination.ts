export type PaginationQuery = {
    page?: number;
    limit?: number;
};

export const buildPagination = (query: PaginationQuery = {}) => {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);

    return {
        page,
        limit,
        skip: (page - 1) * limit,
    };
};

export const buildPaginationMeta = (total: number, page: number, limit: number) => ({
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit),
});
