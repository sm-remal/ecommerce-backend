export type NotificationType = "ORDER" | "REVIEW" | "STOCK" | "COUPON" | "DISCOUNT" | "BANNER" | "SYSTEM";

export type NotificationSeverity = "INFO" | "WARNING" | "CRITICAL";

export type NotificationQuery = {
    type?: NotificationType;
    severity?: NotificationSeverity;
    readStatus?: "READ" | "UNREAD" | "ALL";
    includeDismissed?: boolean;
    limit?: number;
    days?: number;
};

export type NotificationItem = {
    id: string;
    type: NotificationType;
    severity: NotificationSeverity;
    title: string;
    message: string;
    actionUrl: string | null;
    readAt: Date | null;
    dismissedAt: Date | null;
    createdAt: Date;
    reference: {
        id: string;
        label: string;
    } | null;
};

export type NotificationSummary = {
    total: number;
    unread: number;
    dismissed: number;
    critical: number;
    warning: number;
    info: number;
    byType: Record<NotificationType, number>;
};

export type NotificationListResponse = {
    items: NotificationItem[];
    summary: NotificationSummary;
};

export type StockNotificationItem = {
    productId: string;
    name: string;
    sku: string;
    stock: number;
    lowStockThreshold: number;
    stockStatus: string;
};

export type OrderNotificationItem = {
    id: string;
    orderNumber: string;
    customerName: string;
    phone: string;
    status: string;
    estimatedTotal: number | null;
    createdAt: Date;
};

export type ReviewNotificationItem = {
    id: string;
    productId: string;
    productName: string;
    customerName: string;
    rating: number;
    createdAt: Date;
};

export type PromotionNotificationItem = {
    id: string;
    type: "COUPON" | "DISCOUNT" | "BANNER";
    title: string;
    expiresAt: Date;
    daysLeft: number;
};
