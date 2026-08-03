import crypto from "node:crypto";
import config from "../config";
import { AppError } from "./AppError";

type CloudinaryResourceType = "image" | "video" | "raw" | "auto";

type CloudinaryUploadOptions = {
    file: string;
    folder?: string;
    fileName?: string;
    resourceType?: CloudinaryResourceType;
};

type CloudinaryUploadResult = {
    url: string;
    secureUrl: string;
    publicId: string;
    resourceType: string;
    bytes: number;
    originalFilename: string | null;
};

const getCloudinaryConfig = () => {
    if (!config.cloudinary_cloud_name || !config.cloudinary_api_key || !config.cloudinary_api_secret) {
        throw new AppError(500, "Cloudinary is not configured");
    }

    return {
        cloudName: config.cloudinary_cloud_name,
        apiKey: config.cloudinary_api_key,
        apiSecret: config.cloudinary_api_secret,
        folder: config.cloudinary_folder,
    };
};

const signParams = (params: Record<string, string | number | undefined>, apiSecret: string) => {
    const payload = Object.entries(params)
        .filter(([, value]) => typeof value !== "undefined" && value !== "")
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

    return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
};

const parseCloudinaryResponse = async <T>(response: Response): Promise<T> => {
    const data = await response.json().catch(() => undefined) as { error?: { message?: string } } | undefined;

    if (!response.ok) {
        throw new AppError(response.status, data?.error?.message || "Cloudinary request failed");
    }

    return data as T;
};

export const uploadToCloudinary = async (options: CloudinaryUploadOptions): Promise<CloudinaryUploadResult> => {
    const cloudinary = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = options.folder || cloudinary.folder;
    const resourceType = options.resourceType || "auto";
    const signature = signParams({ folder, timestamp }, cloudinary.apiSecret);
    const formData = new FormData();

    formData.append("file", options.file);
    formData.append("api_key", cloudinary.apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", folder);

    if (options.fileName) {
        formData.append("public_id", options.fileName);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/${resourceType}/upload`, {
        method: "POST",
        body: formData,
    });

    const data = await parseCloudinaryResponse<{
        secure_url: string;
        url: string;
        public_id: string;
        resource_type: string;
        bytes: number;
        original_filename?: string;
    }>(response);

    return {
        url: data.url,
        secureUrl: data.secure_url,
        publicId: data.public_id,
        resourceType: data.resource_type,
        bytes: data.bytes,
        originalFilename: data.original_filename || null,
    };
};

export const deleteFromCloudinary = async (publicId: string, resourceType: CloudinaryResourceType = "image") => {
    const cloudinary = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = signParams({ public_id: publicId, timestamp }, cloudinary.apiSecret);
    const formData = new FormData();

    formData.append("public_id", publicId);
    formData.append("api_key", cloudinary.apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/${resourceType}/destroy`, {
        method: "POST",
        body: formData,
    });

    return parseCloudinaryResponse<{ result: string }>(response);
};
