import type { NotificationSummary } from "../notification/notification.interface";

export type DashboardQuery = {
    limit?: number;
    days?: number;
};

export type DashboardMetricCard = {
    label: string;
    value: number;
    helperText?: string;
};

export type DashboardOverview = {
    generatedAt: Date;
    cards: {
        totalProducts: DashboardMetricCard;
        totalCategories: DashboardMetricCard;
        inStock: DashboardMetricCard;
        outOfStock: DashboardMetricCard;
        totalOrders: DashboardMetricCard;
        pendingOrders: DashboardMetricCard;
        totalRevenue: DashboardMetricCard;
        pendingReviews: DashboardMetricCard;
    };
    salesSnapshot: {
        todayOrders: number;
        todayRevenue: number;
        monthlyOrders: number;
        monthlyRevenue: number;
        completedRevenue: number;
        averageOrderValue: number;
    };
    inventorySnapshot: {
        totalStock: number;
        reservedStock: number;
        lowStockProducts: number;
        outOfStockProducts: number;
        comingSoonProducts: number;
    };
    productSnapshot: {
        publishedProducts: number;
        draftProducts: number;
        archivedProducts: number;
        featuredProducts: number;
        trendingProducts: number;
        newArrivalProducts: number;
        totalViews: number;
    };
    recentOrders: Array<{
        id: string;
        orderNumber: string;
        customerName: string;
        phone: string;
        status: string;
        estimatedTotal: number | null;
        createdAt: Date;
    }>;
    lowStockProducts: Array<{
        id: string;
        name: string;
        slug: string;
        sku: string;
        stock: number;
        lowStockThreshold: number;
        stockStatus: string;
    }>;
    topProducts: Array<{
        id: string;
        name: string;
        slug: string;
        sku: string;
        viewCount: number;
    }>;
    categoryDistribution: Array<{
        categoryId: string;
        categoryName: string;
        productCount: number;
    }>;
    monthlyProducts: Array<{
        month: string;
        products: number;
    }>;
    monthlyOrders: Array<{
        month: string;
        orders: number;
        revenue: number;
    }>;
    notifications: NotificationSummary;
};
