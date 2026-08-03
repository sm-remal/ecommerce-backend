import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import { responseMessages } from "../../utility/responseMessages";
import type { CreateMediaPayload, MediaListFilters, UpdateMediaPayload } from "./media.interface";
import {
    buildCreateMediaData,
    buildMediaWhereClause,
    buildUpdateMediaData,
    ensureMediaUploaderExists,
    mapMedia,
    mediaInclude,
    validateMediaPayload,
} from "./media.validation";

const createMedia = async (payload: CreateMediaPayload, userId?: string) => {
    try {
        validateMediaPayload(payload);

        const uploadedById = payload.uploadedById || userId || null;
        await ensureMediaUploaderExists(uploadedById);

        const media = await prisma.media.create({
            data: buildCreateMediaData(payload, uploadedById),
            include: mediaInclude,
        });

        return mapMedia(media);
    } catch (error) {
        throw error;
    }
};

const getMediaList = async (filters: MediaListFilters = {}) => {
    try {
        const where = buildMediaWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);
        const [media, total] = await Promise.all([
            prisma.media.findMany({
                where,
                orderBy: [
                    { createdAt: "desc" },
                ],
                skip,
                take: limit,
                include: mediaInclude,
            }),
            prisma.media.count({ where }),
        ]);

        return {
            items: media.map((item) => mapMedia(item)),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getMediaById = async (id: string) => {
    try {
        const media = await prisma.media.findUnique({
            where: { id },
            include: mediaInclude,
        });

        if (!media) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapMedia(media);
    } catch (error) {
        throw error;
    }
};

const updateMedia = async (id: string, payload: UpdateMediaPayload) => {
    try {
        validateMediaPayload(payload, true);

        const existingMedia = await prisma.media.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existingMedia) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        if (typeof payload.uploadedById !== "undefined") {
            await ensureMediaUploaderExists(payload.uploadedById);
        }

        const media = await prisma.media.update({
            where: { id },
            data: buildUpdateMediaData(payload),
            include: mediaInclude,
        });

        return mapMedia(media);
    } catch (error) {
        throw error;
    }
};

const deleteMedia = async (id: string) => {
    try {
        const existingMedia = await prisma.media.findUnique({
            where: { id },
            select: {
                id: true,
                url: true,
                publicId: true,
            },
        });

        if (!existingMedia) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const deletedMedia = await prisma.media.delete({
            where: { id },
        });

        return {
            id: deletedMedia.id,
            url: deletedMedia.url,
            publicId: deletedMedia.publicId,
        };
    } catch (error) {
        throw error;
    }
};

export const MediaService = {
    createMedia,
    getMediaList,
    getMediaById,
    updateMedia,
    deleteMedia,
};
