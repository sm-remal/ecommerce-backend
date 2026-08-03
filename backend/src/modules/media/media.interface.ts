export type MediaType = "IMAGE" | "VIDEO" | "DOCUMENT";

export type MediaItem = {
    id: string;
    url: string;
    publicId: string | null;
    type: MediaType;
    fileName: string | null;
    size: number | null;
    uploadedById: string | null;
    createdAt: Date;
    uploadedBy: {
        id: string;
        name: string;
        email: string;
    } | null;
};

export type MediaListFilters = {
    search?: string;
    type?: MediaType;
    uploadedById?: string;
    page?: number;
    limit?: number;
};

export type CreateMediaPayload = {
    url: string;
    publicId?: string;
    type?: MediaType;
    fileName?: string;
    size?: number;
    uploadedById?: string | null;
};

export type UpdateMediaPayload = Partial<CreateMediaPayload>;

export type UploadMediaPayload = {
    file: string;
    type?: MediaType;
    fileName?: string;
    folder?: string;
};
