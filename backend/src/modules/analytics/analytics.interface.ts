export type AnalyticsDateRange = {
    startDate?: Date;
    endDate?: Date;
};

export type AnalyticsQuery = AnalyticsDateRange & {
    limit?: number;
};

export type AnalyticsMetric = {
    label: string;
    value: number;
};

export type AnalyticsOverview = {
    dateRange: AnalyticsDateRange;
    totals: {
        products: number;
        publishedProducts: number;
        orders: number;
        completedOrders: number;
        pendingOrders: number;
        users: number;
        reviews: number;
        media: number;
        wishlistItems: number;
        activeCoupons: number;
    };
    revenue: {
        total: number;
        completed: number;
        averageOrderValue: number;
    };
    inventory: {
        totalStock: number;
        reservedStock: number;
        lowStockProducts: number;
        outOfStockProducts: number;
    };
    engagement: {
        totalProductViews: number;
        averageViewsPerProduct: number;
    };
};

export type SalesAnalytics = {
    dateRange: AnalyticsOverview["dateRange"];
    totalOrders: number;
    totalRevenue: number;
    completedRevenue: number;
    averageOrderValue: number;
    ordersByStatus: AnalyticsMetric[];
    ordersByChannel: AnalyticsMetric[];
    dailyRevenue: Array<{
        date: string;
        orders: number;
        revenue: number;
    }>;
};

export type ProductAnalytics = {
    totals: {
        products: number;
        publishedProducts: number;
        featuredProducts: number;
        trendingProducts: number;
        newArrivalProducts: number;
        totalViews: number;
    };
    productsByStockStatus: AnalyticsMetric[];
    productsByCategory: AnalyticsMetric[];
    topViewedProducts: Array<{
        id: string;
        name: string;
        slug: string;
        sku: string;
        viewCount: number;
    }>;
    topWishlistedProducts: Array<{
        productId: string;
        productName: string;
        count: number;
    }>;
};

export type CustomerAnalytics = {
    totals: {
        users: number;
        activeUsers: number;
        inactiveUsers: number;
        suspendedUsers: number;
        newUsers: number;
        wishlistItems: number;
        reviews: number;
    };
    usersByType: AnalyticsMetric[];
    usersByStatus: AnalyticsMetric[];
    latestUsers: Array<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        status: string;
        type: string;
        createdAt: Date;
    }>;
};

export type TrafficAnalytics = {
    totalProductViews: number;
    averageViewsPerProduct: number;
    topViewedProducts: Array<{
        id: string;
        name: string;
        slug: string;
        sku: string;
        viewCount: number;
    }>;
    viewsByCategory: AnalyticsMetric[];
};
