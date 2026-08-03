import { prisma } from "../../lib/prisma";
import config from "../../config";
import { sendEmailSafely } from "../../utility/sendEmail";
import type { ContactInfo, ContactSubmission, ContactSubmissionPayload } from "./contact.interface";

const settingsId = "settings";

const fallbackContactInfo = {
    siteName: "Perfect Gifts Station",
    whatsappNumber: "01734584990",
    messengerLink: null,
    email: "perfectgiftsstation@gmail.com",
    phone: "01734584990",
    address: "Collate Gate, Tongi, Gazipur",
    googleMapEmbed: null,
    businessHours: "Every day from 10:00 AM to 8:00 PM",
    facebookUrl: "https://www.facebook.com/perfectgiftsstation",
    instagramUrl: "https://www.instagram.com/perfectgiftsstation",
    tiktokUrl: "https://www.tiktok.com/@perfectgiftsstation",
    youtubeUrl: null,
};

const normalizeWhatsAppNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "");

    if (digits.startsWith("880")) {
        return digits;
    }

    if (digits.startsWith("0")) {
        return `88${digits}`;
    }

    return digits;
};

const buildWhatsAppLink = (phone: string) => `https://wa.me/${normalizeWhatsAppNumber(phone)}`;

const generateInquiryNumber = () => `CONTACT-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

const getUniqueInquiryNumber = async () => {
    try {
        while (true) {
            const orderNumber = generateInquiryNumber();
            const existingInquiry = await prisma.orderRequest.findUnique({
                where: { orderNumber },
                select: { id: true },
            });

            if (!existingInquiry) {
                return orderNumber;
            }
        }
    } catch (error) {
        throw error;
    }
};

const buildContactMessage = (payload: ContactSubmissionPayload) => {
    const subject = payload.subject?.trim();
    const message = payload.message.trim();

    return subject ? `Subject: ${subject}\n\n${message}` : message;
};

const escapeHtml = (value: string) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getAdminEmail = async () => {
    const settings = await prisma.settings.findUnique({
        where: { id: settingsId },
        select: { email: true },
    });

    return config.admin_email || settings?.email || fallbackContactInfo.email;
};

const sendContactSubmissionEmail = async (
    inquiryNumber: string,
    payload: ContactSubmissionPayload,
    createdAt: Date,
) => {
    const adminEmail = await getAdminEmail();
    const subject = payload.subject?.trim() || "New contact inquiry";
    const customerEmail = payload.email?.trim();
    const customerAddress = payload.address?.trim() || "Not provided";
    const message = payload.message.trim();
    const text = [
        `New contact inquiry received: ${inquiryNumber}`,
        "",
        `Name: ${payload.name.trim()}`,
        `Phone: ${payload.phone.trim()}`,
        `Email: ${customerEmail || "Not provided"}`,
        `Address: ${customerAddress}`,
        `Subject: ${subject}`,
        `Submitted At: ${createdAt.toISOString()}`,
        "",
        "Message:",
        message,
    ].join("\n");
    const html = [
        "<h2>New contact inquiry</h2>",
        "<table>",
        `<tr><td><strong>Inquiry</strong></td><td>${escapeHtml(inquiryNumber)}</td></tr>`,
        `<tr><td><strong>Name</strong></td><td>${escapeHtml(payload.name.trim())}</td></tr>`,
        `<tr><td><strong>Phone</strong></td><td>${escapeHtml(payload.phone.trim())}</td></tr>`,
        `<tr><td><strong>Email</strong></td><td>${escapeHtml(customerEmail || "Not provided")}</td></tr>`,
        `<tr><td><strong>Address</strong></td><td>${escapeHtml(customerAddress)}</td></tr>`,
        `<tr><td><strong>Subject</strong></td><td>${escapeHtml(subject)}</td></tr>`,
        `<tr><td><strong>Submitted At</strong></td><td>${escapeHtml(createdAt.toISOString())}</td></tr>`,
        "</table>",
        "<h3>Message</h3>",
        `<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    ].join("");

    await sendEmailSafely({
        to: adminEmail,
        subject: `[Perfect Gifts Station] ${subject}`,
        text,
        html,
        ...(customerEmail ? { replyTo: customerEmail } : {}),
    });
};

const getContactInfo = async (): Promise<ContactInfo> => {
    try {
        const settings = await prisma.settings.findUnique({
            where: { id: settingsId },
        });

        const info = settings ? {
            siteName: settings.siteName,
            whatsappNumber: settings.whatsappNumber,
            messengerLink: settings.messengerLink,
            email: settings.email,
            phone: settings.phone,
            address: settings.address,
            googleMapEmbed: settings.googleMapEmbed,
            businessHours: settings.businessHours,
            facebookUrl: settings.facebookUrl,
            instagramUrl: settings.instagramUrl,
            tiktokUrl: settings.tiktokUrl,
            youtubeUrl: settings.youtubeUrl,
        } : fallbackContactInfo;

        return {
            ...info,
            whatsappLink: buildWhatsAppLink(info.whatsappNumber),
        };
    } catch (error) {
        throw error;
    }
};

const submitContact = async (payload: ContactSubmissionPayload): Promise<ContactSubmission> => {
    try {
        const inquiryNumber = await getUniqueInquiryNumber();
        const message = buildContactMessage(payload);

        const inquiry = await prisma.orderRequest.create({
            data: {
                orderNumber: inquiryNumber,
                customerName: payload.name.trim(),
                phone: payload.phone.trim(),
                email: payload.email?.trim() || null,
                address: payload.address?.trim() || "Not provided",
                message,
                channel: "EMAIL_FORM",
                estimatedTotal: null,
            },
        });

        await sendContactSubmissionEmail(inquiry.orderNumber, payload, inquiry.createdAt);

        return {
            id: inquiry.id,
            inquiryNumber: inquiry.orderNumber,
            name: inquiry.customerName,
            phone: inquiry.phone,
            email: inquiry.email,
            subject: payload.subject?.trim() || null,
            message: payload.message.trim(),
            status: inquiry.status,
            createdAt: inquiry.createdAt,
        };
    } catch (error) {
        throw error;
    }
};

export const ContactService = {
    getContactInfo,
    submitContact,
};
