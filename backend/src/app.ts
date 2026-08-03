import cookieParser from "cookie-parser";
import express, { type Application, type Request, type Response } from "express";
import cors from "cors"
import config from "./config";
import { ActivityLogRoutes } from "./modules/activityLog/activityLog.route";
import { AnalyticsRoutes } from "./modules/analytics/analytics.route";
import { AuthRoutes } from "./modules/auth/auth.route";
import { BannerRoutes } from "./modules/banner/banner.route";
import { BrandRoutes } from "./modules/brand/brand.route";
import { CategoryRoutes } from "./modules/category/category.route";
import { CouponRoutes } from "./modules/coupon/coupon.route";
import { ContactRoutes } from "./modules/contact/contact.route";
import { DashboardRoutes } from "./modules/dashboard/dashboard.route";
import { DiscountRoutes } from "./modules/discount/discount.route";
import { InventoryRoutes } from "./modules/inventory/inventory.route";
import { MediaRoutes } from "./modules/media/media.route";
import { NotificationRoutes } from "./modules/notification/notification.route";
import { OrderRoutes } from "./modules/order/order.route";
import { ProductRoutes } from "./modules/product/product.route";
import { ProductImageRoutes } from "./modules/productImage/productImage.route";
import { ReportRoutes } from "./modules/report/report.route";
import { ReviewRoutes } from "./modules/review/review.route";
import { SearchFilterRoutes } from "./modules/search_filter/search_filter.route";
import { SeoRoutes } from "./modules/seo/seo.route";
import { SettingsRoutes } from "./modules/settings/settings.route";
import { TagRoutes } from "./modules/tag/tag.route";
import { UserRoutes } from "./modules/user/user.route";
import { WishlistRoutes } from "./modules/wishlist/wishlist.route";
import { globalErrorHandler, notFoundHandler } from "./middleware/globalErrorHandler";
import { requestLogger } from "./middleware/requestLogger";
import {
    authRateLimiter,
    getCorsOrigin,
    rateLimiter,
    requestSanitizer,
    securityHeaders,
} from "./middleware/security";
import { prisma } from "./lib/prisma";

const app: Application = express();
app.disable("x-powered-by");
app.set("trust proxy", config.trust_proxy);

// Middleware
app.use(securityHeaders);
app.use(requestLogger);
app.use(rateLimiter());
app.use(cors({
    origin: getCorsOrigin(),
    credentials: true,
}))
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(requestSanitizer);

app.get("/health", async (req: Request, res: Response, next) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.status(200).json({
            success: true,
            status: "ok",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            database: "ok",
        });
    } catch (error) {
        next(error);
    }
});

// API's
app.use("/api/v1/auth", authRateLimiter, AuthRoutes);
app.use("/api/v1/activity-logs", ActivityLogRoutes);
app.use("/api/v1/analytics", AnalyticsRoutes);
app.use("/api/v1/banners", BannerRoutes);
app.use("/api/v1/brands", BrandRoutes);
app.use("/api/v1/categories", CategoryRoutes);
app.use("/api/v1/coupons", CouponRoutes);
app.use("/api/v1/contact", ContactRoutes);
app.use("/api/v1/dashboard", DashboardRoutes);
app.use("/api/v1/discounts", DiscountRoutes);
app.use("/api/v1/inventories", InventoryRoutes);
app.use("/api/v1/media", MediaRoutes);
app.use("/api/v1/notifications", NotificationRoutes);
app.use("/api/v1/orders", OrderRoutes);
app.use("/api/v1/products", ProductRoutes);
app.use("/api/v1/product-images", ProductImageRoutes);
app.use("/api/v1/reports", ReportRoutes);
app.use("/api/v1/reviews", ReviewRoutes);
app.use("/api/v1/search-filter", SearchFilterRoutes);
app.use("/api/v1/seo", SeoRoutes);
app.use("/api/v1/settings", SettingsRoutes);
app.use("/api/v1/tags", TagRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/wishlist", WishlistRoutes);

// Testing Route
app.get("/", (req: Request, res: Response) => {
    res.json("Backend Server is Running!!")
})

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
