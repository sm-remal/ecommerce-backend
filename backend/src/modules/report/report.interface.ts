export type ReportDateRange = {
    startDate?: Date;
    endDate?: Date;
};

export type ReportQuery = ReportDateRange & {
    limit?: number;
};

export type CountMetric = {
    label: string;
    count: number;
};

export type RevenueMetric = {
    totalOrders: number;
    totalRevenue: number;
    completedRevenue: number;
    averageOrderValue: number;
};

export type OverviewReport = {
    dateRange: ReportDateRange;
    totals: {
        products: number;
        publishedProducts: number;
        orders: number;
        users: number;
        reviews: number;
        pendingReviews: number;
        media: number;
        activeCoupons: number;
    };
    revenue: RevenueMetric;
    inventory: {
        totalStock: number;
        reservedStock: number;
        lowStockProducts: number;
        outOfStockProducts: number;
    };
};

export type SalesReport = {
    dateRange: ReportDateRange;
    revenue: RevenueMetric;
    ordersByStatus: CountMetric[];
    ordersByChannel: CountMetric[];
    dailySales: Array<{
        date: string;
        orders: number;
        revenue: number;
    }>;
    topProducts: Array<{
        productId: string | null;
        productName: string;
        quantity: number;
        revenue: number;
    }>;
};

export type InventoryReport = {
    totals: {
        products: number;
        totalStock: number;
        reservedStock: number;
        lowStockProducts: number;
        outOfStockProducts: number;
    };
    lowStockItems: Array<{
        productId: string;
        name: string;
        sku: string;
        stock: number;
        lowStockThreshold: number;
        stockStatus: string;
    }>;
};

export type ProductReport = {
    totals: {
        products: number;
        publishedProducts: number;
        draftProducts: number;
        archivedProducts: number;
        featuredProducts: number;
        trendingProducts: number;
        newArrivalProducts: number;
    };
    productsByCategory: CountMetric[];
    productsByBrand: CountMetric[];
    topViewedProducts: Array<{
        id: string;
        name: string;
        sku: string;
        viewCount: number;
    }>;
    topReviewedProducts: Array<{
        productId: string;
        productName: string;
        totalReviews: number;
        averageRating: number;
    }>;
};

export type CustomerReport = {
    totals: {
        users: number;
        activeUsers: number;
        inactiveUsers: number;
        suspendedUsers: number;
        newUsers: number;
    };
    usersByType: CountMetric[];
    usersByStatus: CountMetric[];
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
