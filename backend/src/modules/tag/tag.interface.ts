export type TagItem = {
    id: string;
    name: string;
    slug: string;
};

export type TagListFilters = {
    search?: string;
    page?: number;
    limit?: number;
};

export type CreateTagPayload = {
    name: string;
    slug?: string;
};

export type UpdateTagPayload = Partial<CreateTagPayload>;
