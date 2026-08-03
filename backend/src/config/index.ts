import dotenv from "dotenv";
import path from "path"
import { z } from "zod";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const optionalString = z.preprocess((value) => value === "" ? undefined : value, z.string().optional());

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(5000),
    DATABASE_URL: z.string().optional(),
    DATABASE_HOST: z.string().min(1, "DATABASE_HOST is required"),
    DATABASE_USER: z.string().min(1, "DATABASE_USER is required"),
    DATABASE_PASSWORD: z.string().default(""),
    DATABASE_NAME: z.string().min(1, "DATABASE_NAME is required"),
    APP_URL: optionalString,
    BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
    JWT_ACCESS_SECRETE: z.string().min(32, "JWT_ACCESS_SECRETE must be at least 32 characters"),
    JWT_REFRESH_SECRETE: z.string().min(32, "JWT_REFRESH_SECRETE must be at least 32 characters"),
    JWT_ACCESS_EXPIRES_IN: z.string().default("30m"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
    RESET_TOKEN_EXPIRES_IN_MINUTES: z.coerce.number().int().positive().default(15),
    SMTP_HOST: optionalString,
    SMTP_PORT: z.coerce.number().int().positive().default(587),
    SMTP_USER: optionalString,
    SMTP_PASSWORD: optionalString,
    SMTP_SECURE: z.coerce.boolean().default(false),
    EMAIL_FROM: optionalString,
    ADMIN_EMAIL: optionalString,
    CLOUDINARY_CLOUD_NAME: optionalString,
    CLOUDINARY_API_KEY: optionalString,
    CLOUDINARY_API_SECRET: optionalString,
    CLOUDINARY_FOLDER: z.string().default("perfect-gifts"),
    REDIS_URL: optionalString,
    TRUST_PROXY: z.coerce.boolean().default(false),
}).superRefine((env, ctx) => {
    if (env.NODE_ENV === "production" && !env.REDIS_URL) {
        ctx.addIssue({
            code: "custom",
            path: ["REDIS_URL"],
            message: "REDIS_URL is required in production",
        });
    }
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    const message = parsedEnv.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
    throw new Error(`Invalid environment configuration: ${message}`);
}

const env = parsedEnv.data;

export default {
    node_env: env.NODE_ENV,
    port: env.PORT,
    database_url: env.DATABASE_URL,
    app_url: env.APP_URL,
    bcrypt_salt_rounds: String(env.BCRYPT_SALT_ROUNDS),
    jwt_access_secrete: env.JWT_ACCESS_SECRETE,
    jwt_refresh_secrete: env.JWT_REFRESH_SECRETE,
    jwt_access_expires_in: env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: env.JWT_REFRESH_EXPIRES_IN,
    reset_token_expires_in_minutes: String(env.RESET_TOKEN_EXPIRES_IN_MINUTES),

    database_host: env.DATABASE_HOST,
    database_user: env.DATABASE_USER,
    database_password: env.DATABASE_PASSWORD,
    database_name: env.DATABASE_NAME,

    smtp_host: env.SMTP_HOST,
    smtp_port: String(env.SMTP_PORT),
    smtp_user: env.SMTP_USER,
    smtp_password: env.SMTP_PASSWORD,
    smtp_secure: String(env.SMTP_SECURE),
    email_from: env.EMAIL_FROM,
    admin_email: env.ADMIN_EMAIL,

    cloudinary_cloud_name: env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: env.CLOUDINARY_API_SECRET,
    cloudinary_folder: env.CLOUDINARY_FOLDER,

    redis_url: env.REDIS_URL,
    trust_proxy: env.TRUST_PROXY,
}
