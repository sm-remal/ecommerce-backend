import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import type { CreateMediaPayload, MediaItem, MediaListFilters, MediaType, UpdateMediaPayload, UploadMediaPayload } from "./media.interface";

type MediaRecord = {
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

const mediaTypes: MediaType[] = ["IMAGE", "VIDEO", "DOCUMENT"];

export const mediaInclude = {
    uploadedBy: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
};

export const getQueryValue = (value: unknown) => {
    if (Array.isArray(value)) {
        const firstValue = value[0];
        return typeof firstValue === "string" ? firstValue : undefined;
    }

    return typeof value === "string" ? value : undefined;
};

export const parseMediaType = (value: unknown): MediaType | undefined => {
    const type = getQueryValue(value)?.toUpperCase() as MediaType | undefined;
    return type && mediaTypes.includes(type) ? type : undefined;
};

export const mapMedia = (media: MediaRecord | any): MediaItem => ({
    id: media.id,
    url: media.url,
    publicId: media.publicId,
    type: media.type,
    fileName: media.fileName,
    size: media.size,
    uploadedById: media.uploadedById,
    createdAt: media.createdAt,
    uploadedBy: media.uploadedBy,
});

export const buildMediaWhereClause = (filters: MediaListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.type) {
        where.type = filters.type;
    }

    if (filters.uploadedById) {
        where.uploadedById = filters.uploadedById;
    }

    if (filters.search?.trim()) {
        const search = filters.search.trim();
        where.OR = [
            { url: { contains: search } },
            { publicId: { contains: search } },
            { fileName: { contains: search } },
        ];
    }

    return where;
};

export const ensureMediaUploaderExists = async (uploadedById?: string | null) => {
    try {
        if (!uploadedById) {
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: uploadedById },
            select: { id: true },
        });

        if (!user) {
            throw new AppError(404, "Uploader user not found");
        }
    } catch (error) {
        throw error;
    }
};

export const validateMediaPayload = (payload: CreateMediaPayload | UpdateMediaPayload, isUpdate = false) => {
    const url = payload.url?.trim();

    if (!isUpdate && !url) {
        throw new AppError(400, "Media URL is required");
    }

    if (isUpdate && typeof payload.url !== "undefined" && !url) {
        throw new AppError(400, "Media URL cannot be empty");
    }

    if (payload.type && !mediaTypes.includes(payload.type)) {
        throw new AppError(400, "Invalid media type");
    }

    if (typeof payload.size !== "undefined" && (!Number.isFinite(Number(payload.size)) || Number(payload.size) < 0)) {
        throw new AppError(400, "Valid media size is required");
    }
};

export const validateUploadMediaPayload = (payload: UploadMediaPayload) => {
    const file = payload.file?.trim();

    if (!file) {
        throw new AppError(400, "File is required");
    }

    if (payload.type && !mediaTypes.includes(payload.type)) {
        throw new AppError(400, "Invalid media type");
    }

    if (payload.folder && payload.folder.length > 120) {
        throw new AppError(400, "Folder must be 120 characters or less");
    }
};

export const buildCreateMediaData = (payload: CreateMediaPayload, uploadedById?: string | null) => ({
    url: payload.url.trim(),
    publicId: payload.publicId?.trim() || null,
    type: payload.type ?? "IMAGE",
    fileName: payload.fileName?.trim() || null,
    size: typeof payload.size === "undefined" ? null : Number(payload.size),
    ...(uploadedById ? { uploadedBy: { connect: { id: uploadedById } } } : {}),
});

export const buildUpdateMediaData = (payload: UpdateMediaPayload) => ({
    ...(typeof payload.url !== "undefined" ? { url: payload.url.trim() } : {}),
    ...(typeof payload.publicId !== "undefined" ? { publicId: payload.publicId?.trim() || null } : {}),
    ...(typeof payload.type !== "undefined" ? { type: payload.type } : {}),
    ...(typeof payload.fileName !== "undefined" ? { fileName: payload.fileName?.trim() || null } : {}),
    ...(typeof payload.size !== "undefined" ? { size: Number(payload.size) } : {}),
    ...(typeof payload.uploadedById !== "undefined" ? { uploadedBy: payload.uploadedById ? { connect: { id: payload.uploadedById } } : { disconnect: true } } : {}),
});
