import dotenv from "dotenv";
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
    node_env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    app_url: process.env.APP_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secrete: process.env.JWT_ACCESS_SECRETE,
    jwt_refresh_secrete: process.env.JWT_REFRESH_SECRETE,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    reset_token_expires_in_minutes: process.env.RESET_TOKEN_EXPIRES_IN_MINUTES,

    database_host: process.env.DATABASE_HOST,
    database_user: process.env.DATABASE_USER,
    database_password: process.env.DATABASE_PASSWORD,
    database_name: process.env.DATABASE_NAME,

    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_user: process.env.SMTP_USER,
    smtp_password: process.env.SMTP_PASSWORD,
    smtp_secure: process.env.SMTP_SECURE,
    email_from: process.env.EMAIL_FROM,
    admin_email: process.env.ADMIN_EMAIL,
}
