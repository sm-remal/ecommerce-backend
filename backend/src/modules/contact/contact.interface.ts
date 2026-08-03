export type ContactSubmissionPayload = {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message: string;
    address?: string;
};

export type ContactInfo = {
    siteName: string;
    whatsappNumber: string;
    whatsappLink: string;
    messengerLink: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    googleMapEmbed: string | null;
    businessHours: string | null;
    facebookUrl: string | null;
    instagramUrl: string | null;
    tiktokUrl: string | null;
    youtubeUrl: string | null;
};

export type ContactSubmission = {
    id: string;
    inquiryNumber: string;
    name: string;
    phone: string;
    email: string | null;
    subject: string | null;
    message: string;
    status: string;
    createdAt: Date;
};
