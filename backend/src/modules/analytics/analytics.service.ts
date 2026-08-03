import { prisma } from "../../lib/prisma";
import type {
    AnalyticsMetric,
    AnalyticsOverview,
    AnalyticsQuery,
    CustomerAnalytics,
    ProductAnalytics,
    SalesAnalytics,
    TrafficAnalytics,
} from "./analytics.interface";
import { buildDateRangeWhere, getAnalyticsLimit, getDateRange } from "./analytics.validation";

const toMetric = (label: string, value: number): AnalyticsMetric => ({
    label,
    value,
});

const getRevenueTotals = async (where: Record<string, unknown> = {}) => {
    try {
        const [orders, completedOrders, revenue, completedRevenue] = await Promise.all([
            prisma.orderRequest.count({ where }),
            prisma.orderRequest.count({ where: { ...where, status: "COMPLETED" } }),
            prisma.orderRequest.aggregate({
                where,
                _sum: { estimatedTotal: true },
            }),
            prisma.orderRequest.aggregate({
                where: { ...where, status: "COMPLETED" },
                _sum: { estimatedTotal: true },
            }),
        ]);

        const totalRevenue = Number(revenue._sum.estimatedTotal || 0);

        return {
            orders,
            completedOrders,
            totalRevenue,
            completedRevenue: Number(completedRevenue._sum.estimatedTotal || 0),
            averageOrderValue: orders ? totalRevenue / orders : 0,
        };
    } catch (error) {
        throw error;
    }
};

const getOverviewAnalytics = async (query: AnalyticsQuery = {}): Promise<AnalyticsOverview> => {
    try {
        const dateWhere = buildDateRangeWhere(query);

        const [
            revenue,
            pendingOrders,
            products,
            publishedProducts,
            users,
            reviews,
            media,
            wishlistItems,
            activeCoupons,
            inventoryStock,
            lowStockProducts,
            outOfStockProducts,
            productViews,
        ] = await Promise.all([
            getRevenueTotals(dateWhere),
            prisma.orderRequest.count({ where: { ...dateWhere, status: "PENDING" } }),
            prisma.product.count(),
            prisma.product.count({ where: { status: "PUBLISHED" } }),
            prisma.user.count(),
            prisma.review.count({ where: dateWhere }),
            prisma.media.count({ where: dateWhere }),
            prisma.wishlist.count({ where: dateWhere }),
            prisma.coupon.count({
                where: {
                    status: true,
                    startDate: { lte: new Date() },
                    endDate: { gte: new Date() },
                },
            }),
            prisma.inventory.aggregate({
                _sum: {
                    quantity: true,
                    reservedQuantity: true,
                },
            }),
            prisma.product.count({ where: { stockStatus: "LOW_STOCK" } }),
            prisma.product.count({ where: { stockStatus: "OUT_OF_STOCK" } }),
            prisma.product.aggregate({
                _sum: { viewCount: true },
            }),
        ]);

        const totalProductViews = Number(productViews._sum.viewCount || 0);

        return {
            dateRange: getDateRange(query),
            totals: {
                products,
                publishedProducts,
                orders: revenue.orders,
                completedOrders: revenue.completedOrders,
                pendingOrders,
                users,
                reviews,
                media,
                wishlistItems,
                activeCoupons,
            },
            revenue: {
                total: revenue.totalRevenue,
                completed: revenue.completedRevenue,
                averageOrderValue: revenue.averageOrderValue,
            },
            inventory: {
                totalStock: Number(inventoryStock._sum.quantity || 0),
                reservedStock: Number(inventoryStock._sum.reservedQuantity || 0),
                lowStockProducts,
                outOfStockProducts,
            },
            engagement: {
                totalProductViews,
                averageViewsPerProduct: products ? totalProductViews / products : 0,
            },
        };
    } catch (error) {
        throw error;
    }
};

const getSalesAnalytics = async (query: AnalyticsQuery = {}): Promise<SalesAnalytics> => {
    try {
        const dateWhere = buildDateRangeWhere(query);
        const [revenue, statusRows, channelRows, orders] = await Promise.all([
            getRevenueTotals(dateWhere),
            prisma.orderRequest.groupBy({
                by: ["status"],
                where: dateWhere,
                _count: { id: true },
            }),
            prisma.orderRequest.groupBy({
                by: ["channel"],
                where: dateWhere,
                _count: { id: true },
            }),
            prisma.orderRequest.findMany({
                where: dateWhere,
                select: {
                    createdAt: true,
                    estimatedTotal: true,
                },
                orderBy: { createdAt: "asc" },
            }),
        ]);

        const dailyRevenue = Array.from(orders.reduce((map, order) => {
            const date = order.createdAt.toISOString().slice(0, 10);
            const current = map.get(date) || { date, orders: 0, revenue: 0 };
            current.orders += 1;
            current.revenue += Number(order.estimatedTotal || 0);
            map.set(date, current);

            return map;
        }, new Map<string, { date: string; orders: number; revenue: number }>()).values());

        return {
            dateRange: getDateRange(query),
            totalOrders: revenue.orders,
            totalRevenue: revenue.totalRevenue,
            completedRevenue: revenue.completedRevenue,
            averageOrderValue: revenue.averageOrderValue,
            ordersByStatus: statusRows.map((row) => toMetric(row.status, row._count.id)),
            ordersByChannel: channelRows.map((row) => toMetric(row.channel, row._count.id)),
            dailyRevenue,
        };
    } catch (error) {
        throw error;
    }
};

const getProductAnalytics = async (query: AnalyticsQuery = {}): Promise<ProductAnalytics> => {
    try {
        const limit = getAnalyticsLimit(query);
        const [
            products,
            publishedProducts,
            featuredProducts,
            trendingProducts,
            newArrivalProducts,
            productViews,
            stockRows,
            categories,
            topViewedProducts,
            wishlistRows,
        ] = await Promise.all([
            prisma.product.count(),
            prisma.product.count({ where: { status: "PUBLISHED" } }),
            prisma.product.count({ where: { isFeatured: true } }),
            prisma.product.count({ where: { isTrending: true } }),
            prisma.product.count({ where: { isNewArrival: true } }),
            prisma.product.aggregate({ _sum: { viewCount: true } }),
            prisma.product.groupBy({
                by: ["stockStatus"],
                _count: { id: true },
            }),
            prisma.category.findMany({
                select: {
                    name: true,
                    _count: { select: { products: true } },
                },
                orderBy: { name: "asc" },
            }),
            prisma.product.findMany({
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    sku: true,
                    viewCount: true,
                },
                orderBy: { viewCount: "desc" },
                take: limit,
            }),
            prisma.wishlist.groupBy({
                by: ["productId"],
                _count: { id: true },
                orderBy: {
                    _count: {
                        id: "desc",
                    },
                },
                take: limit,
            }),
        ]);

        const wishlistedProductIds = wishlistRows.map((row) => row.productId);
        const wishlistedProducts = wishlistedProductIds.length
            ? await prisma.product.findMany({
                where: { id: { in: wishlistedProductIds } },
                select: { id: true, name: true },
            })
            : [];
        const productNameById = new Map(wishlistedProducts.map((product) => [product.id, product.name]));

        return {
            totals: {
                products,
                publishedProducts,
                featuredProducts,
                trendingProducts,
                newArrivalProducts,
                totalViews: Number(productViews._sum.viewCount || 0),
            },
            productsByStockStatus: stockRows.map((row) => toMetric(row.stockStatus, row._count.id)),
            productsByCategory: categories.map((category) => toMetric(category.name, category._count.products)),
            topViewedProducts,
            topWishlistedProducts: wishlistRows.map((row) => ({
                productId: row.productId,
                productName: productNameById.get(row.productId) || "Unknown",
                count: row._count.id,
            })),
        };
    } catch (error) {
        throw error;
    }
};

const getCustomerAnalytics = async (query: AnalyticsQuery = {}): Promise<CustomerAnalytics> => {
    try {
        const limit = getAnalyticsLimit(query);
        const dateWhere = buildDateRangeWhere(query);
        const [users, activeUsers, inactiveUsers, suspendedUsers, newUsers, wishlistItems, reviews, typeRows, statusRows, latestUsers] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { status: "ACTIVE" } }),
            prisma.user.count({ where: { status: "INACTIVE" } }),
            prisma.user.count({ where: { status: "SUSPENDED" } }),
            prisma.user.count({ where: dateWhere }),
            prisma.wishlist.count({ where: dateWhere }),
            prisma.review.count({ where: dateWhere }),
            prisma.user.groupBy({
                by: ["type"],
                _count: { id: true },
            }),
            prisma.user.groupBy({
                by: ["status"],
                _count: { id: true },
            }),
            prisma.user.findMany({
                where: dateWhere,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    status: true,
                    type: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            }),
        ]);

        return {
            totals: {
                users,
                activeUsers,
                inactiveUsers,
                suspendedUsers,
                newUsers,
                wishlistItems,
                reviews,
            },
            usersByType: typeRows.map((row) => toMetric(row.type, row._count.id)),
            usersByStatus: statusRows.map((row) => toMetric(row.status, row._count.id)),
            latestUsers,
        };
    } catch (error) {
        throw error;
    }
};

const getTrafficAnalytics = async (query: AnalyticsQuery = {}): Promise<TrafficAnalytics> => {
    try {
        const limit = getAnalyticsLimit(query);
        const [products, productViews, topViewedProducts, categories] = await Promise.all([
            prisma.product.count(),
            prisma.product.aggregate({ _sum: { viewCount: true } }),
            prisma.product.findMany({
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    sku: true,
                    viewCount: true,
                },
                orderBy: { viewCount: "desc" },
                take: limit,
            }),
            prisma.category.findMany({
                select: {
                    name: true,
                    products: {
                        select: {
                            viewCount: true,
                        },
                    },
                },
                orderBy: { name: "asc" },
            }),
        ]);

        const totalProductViews = Number(productViews._sum.viewCount || 0);

        return {
            totalProductViews,
            averageViewsPerProduct: products ? totalProductViews / products : 0,
            topViewedProducts,
            viewsByCategory: categories.map((category) => toMetric(
                category.name,
                category.products.reduce((total, product) => total + product.viewCount, 0),
            )),
        };
    } catch (error) {
        throw error;
    }
};

export const AnalyticsService = {
    getOverviewAnalytics,
    getSalesAnalytics,
    getProductAnalytics,
    getCustomerAnalytics,
    getTrafficAnalytics,
};
