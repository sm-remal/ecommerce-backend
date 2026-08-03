export type SettingsItem = {
    id: string;
    siteName: string;
    logo: string | null;
    favicon: string | null;
    whatsappNumber: string;
    messengerLink: string | null;
    facebookUrl: string | null;
    instagramUrl: string | null;
    tiktokUrl: string | null;
    youtubeUrl: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    googleMapEmbed: string | null;
    businessHours: string | null;
    footerText: string | null;
    gaId: string | null;
    gscId: string | null;
    fbPixelId: string | null;
    updatedAt: Date;
};

export type CreateSettingsPayload = {
    siteName: string;
    logo?: string;
    favicon?: string;
    whatsappNumber: string;
    messengerLink?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    youtubeUrl?: string;
    email?: string;
    phone?: string;
    address?: string;
    googleMapEmbed?: string;
    businessHours?: string;
    footerText?: string;
    gaId?: string;
    gscId?: string;
    fbPixelId?: string;
};

export type UpdateSettingsPayload = Partial<CreateSettingsPayload>;
