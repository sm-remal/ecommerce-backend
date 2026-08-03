import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import type {
    NotificationItem,
    NotificationQuery,
    NotificationSummary,
    NotificationType,
    OrderNotificationItem,
    PromotionNotificationItem,
    ReviewNotificationItem,
    StockNotificationItem,
} from "./notification.interface";
import { getExpiryDateLimit, getNotificationLimit } from "./notification.validation";

type PersistedNotification = {
    id: string;
    type: NotificationType;
    severity: "INFO" | "WARNING" | "CRITICAL";
    title: string;
    message: string;
    actionUrl: string | null;
    referenceId: string | null;
    referenceLabel: string | null;
    readAt: Date | null;
    dismissedAt: Date | null;
    createdAt: Date;
};

type DerivedNotificationInput = Omit<NotificationItem, "id" | "readAt" | "dismissedAt"> & {
    sourceKey: string;
};

const countInitialValue: NotificationSummary["byType"] = {
    ORDER: 0,
    REVIEW: 0,
    STOCK: 0,
    COUPON: 0,
    DISCOUNT: 0,
    BANNER: 0,
    SYSTEM: 0,
};

const buildSummary = (items: NotificationItem[]): NotificationSummary => ({
    total: items.length,
    unread: items.filter((item) => !item.readAt).length,
    dismissed: items.filter((item) => item.dismissedAt).length,
    critical: items.filter((item) => item.severity === "CRITICAL").length,
    warning: items.filter((item) => item.severity === "WARNING").length,
    info: items.filter((item) => item.severity === "INFO").length,
    byType: items.reduce((counts, item) => ({
        ...counts,
        [item.type]: counts[item.type] + 1,
    }), countInitialValue),
});

const mapPersistedNotification = (notification: PersistedNotification): NotificationItem => ({
    id: notification.id,
    type: notification.type,
    severity: notification.severity,
    title: notification.title,
    message: notification.message,
    actionUrl: notification.actionUrl,
    readAt: notification.readAt,
    dismissedAt: notification.dismissedAt,
    createdAt: notification.createdAt,
    reference: notification.referenceId || notification.referenceLabel
        ? {
            id: notification.referenceId || "",
            label: notification.referenceLabel || "",
        }
        : null,
});

const getRecipientWhere = (userId?: string) => userId
    ? { OR: [{ recipientId: userId }, { recipientId: null }] }
    : { recipientId: null };

const buildNotificationWhereClause = (query: NotificationQuery = {}, userId?: string) => ({
    ...getRecipientWhere(userId),
    ...(query.type ? { type: query.type } : {}),
    ...(query.severity ? { severity: query.severity } : {}),
    ...(query.readStatus === "READ" ? { readAt: { not: null } } : {}),
    ...(query.readStatus === "UNREAD" ? { readAt: null } : {}),
    ...(!query.includeDismissed ? { dismissedAt: null } : {}),
});

const buildSourceKey = (sourceKey: string, userId?: string) => `${userId || "global"}:${sourceKey}`;

const syncDerivedNotifications = async (notifications: DerivedNotificationInput[], userId?: string) => {
    try {
        await Promise.all(notifications.map((notification) => prisma.notification.upsert({
            where: { sourceKey: buildSourceKey(notification.sourceKey, userId) },
            create: {
                recipientId: userId || null,
                sourceKey: buildSourceKey(notification.sourceKey, userId),
                type: notification.type,
                severity: notification.severity,
                title: notification.title,
                message: notification.message,
                actionUrl: notification.actionUrl,
                referenceId: notification.reference?.id || null,
                referenceLabel: notification.reference?.label || null,
                createdAt: notification.createdAt,
            },
            update: {
                type: notification.type,
                severity: notification.severity,
                title: notification.title,
                message: notification.message,
                actionUrl: notification.actionUrl,
                referenceId: notification.reference?.id || null,
                referenceLabel: notification.reference?.label || null,
            },
        })));
    } catch (error) {
        throw error;
    }
};

const getStockNotifications = async (query: NotificationQuery = {}): Promise<StockNotificationItem[]> => {
    try {
        const limit = getNotificationLimit(query);

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { stockStatus: "LOW_STOCK" },
                    { stockStatus: "OUT_OF_STOCK" },
                    { stock: { lte: 3 } },
                ],
            },
            select: {
                id: true,
                name: true,
                sku: true,
                stock: true,
                lowStockThreshold: true,
                stockStatus: true,
            },
            orderBy: [
                { stock: "asc" },
                { name: "asc" },
            ],
            take: limit,
        });

        return products.map((product) => ({
            productId: product.id,
            name: product.name,
            sku: product.sku,
            stock: product.stock,
            lowStockThreshold: product.lowStockThreshold,
            stockStatus: product.stockStatus,
        }));
    } catch (error) {
        throw error;
    }
};

const getPendingOrderNotifications = async (query: NotificationQuery = {}): Promise<OrderNotificationItem[]> => {
    try {
        const limit = getNotificationLimit(query);

        const orders = await prisma.orderRequest.findMany({
            where: { status: "PENDING" },
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                phone: true,
                status: true,
                estimatedTotal: true,
                createdAt: true,
            },
            orderBy: { createdAt: "asc" },
            take: limit,
        });

        return orders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            phone: order.phone,
            status: order.status,
            estimatedTotal: order.estimatedTotal === null ? null : Number(order.estimatedTotal),
            createdAt: order.createdAt,
        }));
    } catch (error) {
        throw error;
    }
};

const getPendingReviewNotifications = async (query: NotificationQuery = {}): Promise<ReviewNotificationItem[]> => {
    try {
        const limit = getNotificationLimit(query);

        const reviews = await prisma.review.findMany({
            where: { status: false },
            select: {
                id: true,
                productId: true,
                customerName: true,
                rating: true,
                createdAt: true,
                product: {
                    select: { name: true },
                },
            },
            orderBy: { createdAt: "asc" },
            take: limit,
        });

        return reviews.map((review) => ({
            id: review.id,
            productId: review.productId,
            productName: review.product.name,
            customerName: review.customerName,
            rating: review.rating,
            createdAt: review.createdAt,
        }));
    } catch (error) {
        throw error;
    }
};

const getPromotionNotifications = async (query: NotificationQuery = {}): Promise<PromotionNotificationItem[]> => {
    try {
        const now = new Date();
        const expiryLimit = getExpiryDateLimit(query);
        const limit = getNotificationLimit(query);

        const [coupons, discounts, banners] = await Promise.all([
            prisma.coupon.findMany({
                where: { status: true, endDate: { gte: now, lte: expiryLimit } },
                select: { id: true, code: true, endDate: true },
                orderBy: { endDate: "asc" },
                take: limit,
            }),
            prisma.discount.findMany({
                where: { status: true, endDate: { gte: now, lte: expiryLimit } },
                select: { id: true, name: true, endDate: true },
                orderBy: { endDate: "asc" },
                take: limit,
            }),
            prisma.banner.findMany({
                where: { isActive: true, expiryAt: { gte: now, lte: expiryLimit } },
                select: { id: true, title: true, expiryAt: true },
                orderBy: { expiryAt: "asc" },
                take: limit,
            }),
        ]);

        const getDaysLeft = (date: Date) => Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return [
            ...coupons.map((coupon) => ({
                id: coupon.id,
                type: "COUPON" as const,
                title: coupon.code,
                expiresAt: coupon.endDate,
                daysLeft: getDaysLeft(coupon.endDate),
            })),
            ...discounts.map((discount) => ({
                id: discount.id,
                type: "DISCOUNT" as const,
                title: discount.name,
                expiresAt: discount.endDate,
                daysLeft: getDaysLeft(discount.endDate),
            })),
            ...banners
                .filter((banner) => banner.expiryAt)
                .map((banner) => ({
                    id: banner.id,
                    type: "BANNER" as const,
                    title: banner.title,
                    expiresAt: banner.expiryAt!,
                    daysLeft: getDaysLeft(banner.expiryAt!),
                })),
        ].sort((first, second) => first.expiresAt.getTime() - second.expiresAt.getTime()).slice(0, limit);
    } catch (error) {
        throw error;
    }
};

const buildDerivedNotificationInputs = async (query: NotificationQuery = {}): Promise<DerivedNotificationInput[]> => {
    const [stocks, orders, reviews, promotions] = await Promise.all([
        getStockNotifications(query),
        getPendingOrderNotifications(query),
        getPendingReviewNotifications(query),
        getPromotionNotifications(query),
    ]);

    const now = new Date();

    return [
        ...stocks.map((product) => ({
            sourceKey: `stock-${product.productId}`,
            type: "STOCK" as const,
            severity: product.stock <= 0 ? "CRITICAL" as const : "WARNING" as const,
            title: product.stock <= 0 ? "Product out of stock" : "Product stock is low",
            message: `${product.name} (${product.sku}) has ${product.stock} item(s) available.`,
            actionUrl: `/dashboard/products/${product.productId}`,
            createdAt: now,
            reference: { id: product.productId, label: product.name },
        })),
        ...orders.map((order) => ({
            sourceKey: `order-${order.id}`,
            type: "ORDER" as const,
            severity: "INFO" as const,
            title: "New order inquiry pending",
            message: `${order.customerName} submitted order ${order.orderNumber}.`,
            actionUrl: `/dashboard/orders/${order.id}`,
            createdAt: order.createdAt,
            reference: { id: order.id, label: order.orderNumber },
        })),
        ...reviews.map((review) => ({
            sourceKey: `review-${review.id}`,
            type: "REVIEW" as const,
            severity: "INFO" as const,
            title: "Review waiting for approval",
            message: `${review.customerName} left a ${review.rating}-star review for ${review.productName}.`,
            actionUrl: `/dashboard/reviews/${review.id}`,
            createdAt: review.createdAt,
            reference: { id: review.id, label: review.productName },
        })),
        ...promotions.map((promotion) => ({
            sourceKey: `${promotion.type.toLowerCase()}-${promotion.id}`,
            type: promotion.type,
            severity: promotion.daysLeft <= 1 ? "CRITICAL" as const : "WARNING" as const,
            title: `${promotion.type.toLowerCase()} expiring soon`,
            message: `${promotion.title} expires in ${promotion.daysLeft} day(s).`,
            actionUrl: `/dashboard/${promotion.type.toLowerCase()}s/${promotion.id}`,
            createdAt: promotion.expiresAt,
            reference: { id: promotion.id, label: promotion.title },
        })),
    ];
};

const getNotifications = async (query: NotificationQuery = {}, userId?: string) => {
    try {
        const limit = getNotificationLimit(query);
        await syncDerivedNotifications(await buildDerivedNotificationInputs(query), userId);

        const notifications = await prisma.notification.findMany({
            where: buildNotificationWhereClause(query, userId),
            orderBy: [
                { severity: "desc" },
                { createdAt: "desc" },
            ],
            take: limit,
        });
        const items = notifications.map((notification) => mapPersistedNotification(notification));

        return {
            items,
            summary: buildSummary(items),
        };
    } catch (error) {
        throw error;
    }
};

const getNotificationSummary = async (query: NotificationQuery = {}, userId?: string) => {
    try {
        const notifications = await getNotifications({
            ...query,
            limit: query.limit ?? 100,
        }, userId);

        return notifications.summary;
    } catch (error) {
        throw error;
    }
};

const ensureNotificationAccess = async (id: string, userId?: string) => {
    const notification = await prisma.notification.findFirst({
        where: {
            id,
            ...getRecipientWhere(userId),
        },
    });

    if (!notification) {
        throw new AppError(404, "Notification not found");
    }

    return notification;
};

const markNotificationAsRead = async (id: string, userId?: string) => {
    await ensureNotificationAccess(id, userId);

    const notification = await prisma.notification.update({
        where: { id },
        data: { readAt: new Date() },
    });

    return mapPersistedNotification(notification);
};

const markNotificationAsUnread = async (id: string, userId?: string) => {
    await ensureNotificationAccess(id, userId);

    const notification = await prisma.notification.update({
        where: { id },
        data: { readAt: null },
    });

    return mapPersistedNotification(notification);
};

const dismissNotification = async (id: string, userId?: string) => {
    await ensureNotificationAccess(id, userId);

    const notification = await prisma.notification.update({
        where: { id },
        data: { dismissedAt: new Date() },
    });

    return mapPersistedNotification(notification);
};

const markAllNotificationsAsRead = async (userId?: string) => {
    const result = await prisma.notification.updateMany({
        where: {
            ...getRecipientWhere(userId),
            readAt: null,
            dismissedAt: null,
        },
        data: { readAt: new Date() },
    });

    return { updatedCount: result.count };
};

const dismissAllNotifications = async (userId?: string) => {
    const result = await prisma.notification.updateMany({
        where: {
            ...getRecipientWhere(userId),
            dismissedAt: null,
        },
        data: { dismissedAt: new Date() },
    });

    return { updatedCount: result.count };
};

export const NotificationService = {
    getNotifications,
    getNotificationSummary,
    getStockNotifications,
    getPendingOrderNotifications,
    getPendingReviewNotifications,
    getPromotionNotifications,
    markNotificationAsRead,
    markNotificationAsUnread,
    dismissNotification,
    markAllNotificationsAsRead,
    dismissAllNotifications,
};
