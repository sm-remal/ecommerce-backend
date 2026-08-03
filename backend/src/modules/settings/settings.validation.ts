import { AppError } from "../../utility/AppError";
import type { CreateSettingsPayload, SettingsItem, UpdateSettingsPayload } from "./settings.interface";

type SettingsRecord = SettingsItem;

const urlFields: Array<keyof Pick<
    CreateSettingsPayload,
    "logo" | "favicon" | "messengerLink" | "facebookUrl" | "instagramUrl" | "tiktokUrl" | "youtubeUrl"
>> = ["logo", "favicon", "messengerLink", "facebookUrl", "instagramUrl", "tiktokUrl", "youtubeUrl"];

const nullableString = (value: string | undefined) => value?.trim() || null;

const isValidUrlLike = (value: string) => {
    if (value.startsWith("/")) {
        return true;
    }

    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

const validateUrlFields = (payload: CreateSettingsPayload | UpdateSettingsPayload) => {
    for (const field of urlFields) {
        const value = payload[field]?.trim();
        if (value && !isValidUrlLike(value)) {
            throw new AppError(400, `${String(field)} must be a valid URL or path`);
        }
    }
};

const validateEmail = (email?: string) => {
    if (!email?.trim()) {
        return;
    }

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!isValid) {
        throw new AppError(400, "Valid email is required");
    }
};

export const validateCreateSettingsPayload = (payload: CreateSettingsPayload) => {
    const siteName = payload.siteName?.trim();
    const whatsappNumber = payload.whatsappNumber?.trim();

    if (!siteName) {
        throw new AppError(400, "Site name is required");
    }

    if (!whatsappNumber) {
        throw new AppError(400, "WhatsApp number is required");
    }

    validateEmail(payload.email);
    validateUrlFields(payload);
};

export const validateUpdateSettingsPayload = (payload: UpdateSettingsPayload) => {
    if (typeof payload.siteName !== "undefined" && !payload.siteName?.trim()) {
        throw new AppError(400, "Site name cannot be empty");
    }

    if (typeof payload.whatsappNumber !== "undefined" && !payload.whatsappNumber?.trim()) {
        throw new AppError(400, "WhatsApp number cannot be empty");
    }

    validateEmail(payload.email);
    validateUrlFields(payload);
};

export const mapSettings = (settings: SettingsRecord): SettingsItem => ({
    id: settings.id,
    siteName: settings.siteName,
    logo: settings.logo,
    favicon: settings.favicon,
    whatsappNumber: settings.whatsappNumber,
    messengerLink: settings.messengerLink,
    facebookUrl: settings.facebookUrl,
    instagramUrl: settings.instagramUrl,
    tiktokUrl: settings.tiktokUrl,
    youtubeUrl: settings.youtubeUrl,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    googleMapEmbed: settings.googleMapEmbed,
    businessHours: settings.businessHours,
    footerText: settings.footerText,
    gaId: settings.gaId,
    gscId: settings.gscId,
    fbPixelId: settings.fbPixelId,
    updatedAt: settings.updatedAt,
});

export const buildCreateSettingsData = (payload: CreateSettingsPayload) => ({
    siteName: payload.siteName.trim(),
    logo: nullableString(payload.logo),
    favicon: nullableString(payload.favicon),
    whatsappNumber: payload.whatsappNumber.trim(),
    messengerLink: nullableString(payload.messengerLink),
    facebookUrl: nullableString(payload.facebookUrl),
    instagramUrl: nullableString(payload.instagramUrl),
    tiktokUrl: nullableString(payload.tiktokUrl),
    youtubeUrl: nullableString(payload.youtubeUrl),
    email: nullableString(payload.email),
    phone: nullableString(payload.phone),
    address: nullableString(payload.address),
    googleMapEmbed: nullableString(payload.googleMapEmbed),
    businessHours: nullableString(payload.businessHours),
    footerText: nullableString(payload.footerText),
    gaId: nullableString(payload.gaId),
    gscId: nullableString(payload.gscId),
    fbPixelId: nullableString(payload.fbPixelId),
});

export const buildUpdateSettingsData = (payload: UpdateSettingsPayload) => ({
    ...(typeof payload.siteName !== "undefined" ? { siteName: payload.siteName.trim() } : {}),
    ...(typeof payload.logo !== "undefined" ? { logo: nullableString(payload.logo) } : {}),
    ...(typeof payload.favicon !== "undefined" ? { favicon: nullableString(payload.favicon) } : {}),
    ...(typeof payload.whatsappNumber !== "undefined" ? { whatsappNumber: payload.whatsappNumber.trim() } : {}),
    ...(typeof payload.messengerLink !== "undefined" ? { messengerLink: nullableString(payload.messengerLink) } : {}),
    ...(typeof payload.facebookUrl !== "undefined" ? { facebookUrl: nullableString(payload.facebookUrl) } : {}),
    ...(typeof payload.instagramUrl !== "undefined" ? { instagramUrl: nullableString(payload.instagramUrl) } : {}),
    ...(typeof payload.tiktokUrl !== "undefined" ? { tiktokUrl: nullableString(payload.tiktokUrl) } : {}),
    ...(typeof payload.youtubeUrl !== "undefined" ? { youtubeUrl: nullableString(payload.youtubeUrl) } : {}),
    ...(typeof payload.email !== "undefined" ? { email: nullableString(payload.email) } : {}),
    ...(typeof payload.phone !== "undefined" ? { phone: nullableString(payload.phone) } : {}),
    ...(typeof payload.address !== "undefined" ? { address: nullableString(payload.address) } : {}),
    ...(typeof payload.googleMapEmbed !== "undefined" ? { googleMapEmbed: nullableString(payload.googleMapEmbed) } : {}),
    ...(typeof payload.businessHours !== "undefined" ? { businessHours: nullableString(payload.businessHours) } : {}),
    ...(typeof payload.footerText !== "undefined" ? { footerText: nullableString(payload.footerText) } : {}),
    ...(typeof payload.gaId !== "undefined" ? { gaId: nullableString(payload.gaId) } : {}),
    ...(typeof payload.gscId !== "undefined" ? { gscId: nullableString(payload.gscId) } : {}),
    ...(typeof payload.fbPixelId !== "undefined" ? { fbPixelId: nullableString(payload.fbPixelId) } : {}),
});
