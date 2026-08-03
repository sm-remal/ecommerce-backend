import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import type { CreateSettingsPayload, UpdateSettingsPayload } from "./settings.interface";
import {
    buildCreateSettingsData,
    buildUpdateSettingsData,
    mapSettings,
    validateCreateSettingsPayload,
    validateUpdateSettingsPayload,
} from "./settings.validation";

const settingsId = "settings";

const createSettings = async (payload: CreateSettingsPayload) => {
    try {
        validateCreateSettingsPayload(payload);

        const existingSettings = await prisma.settings.findUnique({
            where: { id: settingsId },
            select: { id: true },
        });

        if (existingSettings) {
            throw new AppError(409, "Settings already exists");
        }

        const settings = await prisma.settings.create({
            data: {
                id: settingsId,
                ...buildCreateSettingsData(payload),
            },
        });

        return mapSettings(settings);
    } catch (error) {
        throw error;
    }
};

const getSettings = async () => {
    try {
        const settings = await prisma.settings.findUnique({
            where: { id: settingsId },
        });

        if (!settings) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapSettings(settings);
    } catch (error) {
        throw error;
    }
};

const upsertSettings = async (payload: CreateSettingsPayload) => {
    try {
        validateCreateSettingsPayload(payload);

        const settings = await prisma.settings.upsert({
            where: { id: settingsId },
            create: {
                id: settingsId,
                ...buildCreateSettingsData(payload),
            },
            update: buildCreateSettingsData(payload),
        });

        return mapSettings(settings);
    } catch (error) {
        throw error;
    }
};

const updateSettings = async (payload: UpdateSettingsPayload) => {
    try {
        validateUpdateSettingsPayload(payload);

        const existingSettings = await prisma.settings.findUnique({
            where: { id: settingsId },
            select: { id: true },
        });

        if (!existingSettings) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const settings = await prisma.settings.update({
            where: { id: settingsId },
            data: buildUpdateSettingsData(payload),
        });

        return mapSettings(settings);
    } catch (error) {
        throw error;
    }
};

const deleteSettings = async () => {
    try {
        const existingSettings = await prisma.settings.findUnique({
            where: { id: settingsId },
            select: { id: true, siteName: true },
        });

        if (!existingSettings) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        const deletedSettings = await prisma.settings.delete({
            where: { id: settingsId },
        });

        return {
            id: deletedSettings.id,
            siteName: deletedSettings.siteName,
        };
    } catch (error) {
        throw error;
    }
};

export const SettingsService = {
    createSettings,
    getSettings,
    upsertSettings,
    updateSettings,
    deleteSettings,
};
