import { prisma } from "../../lib/prisma";
import { NotificationService } from "../notification/notification.service";
import type { DashboardOverview, DashboardQuery } from "./dashboard.interface";
import { getDashboardDays, getDashboardLimit } from "./dashboard.validation";

const getStartOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getStartOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const formatMonth = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getRangeStartDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

const getOrderRevenue = async (where: Record<string, unknown>) => {
    try {
        const [orders, revenue] = await Promise.all([
            prisma.orderRequest.count({ where }),
            prisma.orderRequest.aggregate({
                where,
                _sum: { estimatedTotal: true },
            }),
        ]);

        return {
            orders,
            revenue: Number(revenue._sum.estimatedTotal || 0),
        };
    } catch (error) {
        throw error;
    }
};

const getDashboardOverview = async (query: DashboardQuery = {}): Promise<DashboardOverview> => {
    try {
        const limit = getDashboardLimit(query);
        const days = getDashboardDays(query);
        const now = new Date();
        const startOfToday = getStartOfDay(now);
        const startOfMonth = getStartOfMonth(now);
        const rangeStartDate = getRangeStartDate(days);

        const [
            totalProducts,
            totalCategories,
            inStock,
            outOfStock,
            totalOrders,
            pendingOrders,
            totalRevenue,
            completedRevenue,
            pendingReviews,
            todaySales,
            monthlySales,
            inventoryStock,
            lowStockProductsCount,
            comingSoonProducts,
            productViews,
            publishedProducts,
            draftProducts,
            archivedProducts,
            featuredProducts,
            trendingProducts,
            newArrivalProducts,
            recentOrders,
            lowStockProducts,
            topProducts,
            categories,
            productsInRange,
            ordersInRange,
            notifications,
        ] = await Promise.all([
            prisma.product.count(),
            prisma.category.count(),
            prisma.product.count({ where: { stockStatus: { in: ["AVAILABLE", "LOW_STOCK"] } } }),
            prisma.product.count({ where: { stockStatus: "OUT_OF_STOCK" } }),
            prisma.orderRequest.count(),
            prisma.orderRequest.count({ where: { status: "PENDING" } }),
            prisma.orderRequest.aggregate({ _sum: { estimatedTotal: true } }),
            prisma.orderRequest.aggregate({
                where: { status: "COMPLETED" },
                _sum: { estimatedTotal: true },
            }),
            prisma.review.count({ where: { status: false } }),
            getOrderRevenue({ createdAt: { gte: startOfToday } }),
            getOrderRevenue({ createdAt: { gte: startOfMonth } }),
            prisma.inventory.aggregate({
                _sum: {
                    quantity: true,
                    reservedQuantity: true,
                },
            }),
            prisma.product.count({ where: { stockStatus: "LOW_STOCK" } }),
            prisma.product.count({ where: { stockStatus: "COMING_SOON" } }),
            prisma.product.aggregate({ _sum: { viewCount: true } }),
            prisma.product.count({ where: { status: "PUBLISHED" } }),
            prisma.product.count({ where: { status: "DRAFT" } }),
            prisma.product.count({ where: { status: "ARCHIVED" } }),
            prisma.product.count({ where: { isFeatured: true } }),
            prisma.product.count({ where: { isTrending: true } }),
            prisma.product.count({ where: { isNewArrival: true } }),
            prisma.orderRequest.findMany({
                select: {
                    id: true,
                    orderNumber: true,
                    customerName: true,
                    phone: true,
                    status: true,
                    estimatedTotal: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            }),
            prisma.product.findMany({
                where: {
                    OR: [
                        { stockStatus: "LOW_STOCK" },
                        { stockStatus: "OUT_OF_STOCK" },
                    ],
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
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
            prisma.category.findMany({
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: { products: true },
                    },
                },
                orderBy: { name: "asc" },
            }),
            prisma.product.findMany({
                where: { createdAt: { gte: rangeStartDate } },
                select: { createdAt: true },
                orderBy: { createdAt: "asc" },
            }),
            prisma.orderRequest.findMany({
                where: { createdAt: { gte: rangeStartDate } },
                select: {
                    createdAt: true,
                    estimatedTotal: true,
                },
                orderBy: { createdAt: "asc" },
            }),
            NotificationService.getNotificationSummary({ limit: 100 }),
        ]);

        const totalRevenueAmount = Number(totalRevenue._sum.estimatedTotal || 0);
        const completedRevenueAmount = Number(completedRevenue._sum.estimatedTotal || 0);
        const monthlyProducts = Array.from(productsInRange.reduce((map, product) => {
            const month = formatMonth(product.createdAt);
            map.set(month, (map.get(month) || 0) + 1);
            return map;
        }, new Map<string, number>()).entries()).map(([month, products]) => ({ month, products }));
        const monthlyOrders = Array.from(ordersInRange.reduce((map, order) => {
            const month = formatMonth(order.createdAt);
            const current = map.get(month) || { month, orders: 0, revenue: 0 };
            current.orders += 1;
            current.revenue += Number(order.estimatedTotal || 0);
            map.set(month, current);
            return map;
        }, new Map<string, { month: string; orders: number; revenue: number }>()).values());

        return {
            generatedAt: now,
            cards: {
                totalProducts: {
                    label: "Total Products",
                    value: totalProducts,
                    helperText: `${publishedProducts} published`,
                },
                totalCategories: {
                    label: "Categories",
                    value: totalCategories,
                },
                inStock: {
                    label: "In Stock",
                    value: inStock,
                },
                outOfStock: {
                    label: "Out of Stock",
                    value: outOfStock,
                },
                totalOrders: {
                    label: "Total Orders",
                    value: totalOrders,
                    helperText: `${monthlySales.orders} this month`,
                },
                pendingOrders: {
                    label: "Pending Orders",
                    value: pendingOrders,
                },
                totalRevenue: {
                    label: "Total Revenue",
                    value: totalRevenueAmount,
                    helperText: `${completedRevenueAmount} completed`,
                },
                pendingReviews: {
                    label: "Pending Reviews",
                    value: pendingReviews,
                },
            },
            salesSnapshot: {
                todayOrders: todaySales.orders,
                todayRevenue: todaySales.revenue,
                monthlyOrders: monthlySales.orders,
                monthlyRevenue: monthlySales.revenue,
                completedRevenue: completedRevenueAmount,
                averageOrderValue: totalOrders ? totalRevenueAmount / totalOrders : 0,
            },
            inventorySnapshot: {
                totalStock: Number(inventoryStock._sum.quantity || 0),
                reservedStock: Number(inventoryStock._sum.reservedQuantity || 0),
                lowStockProducts: lowStockProductsCount,
                outOfStockProducts: outOfStock,
                comingSoonProducts,
            },
            productSnapshot: {
                publishedProducts,
                draftProducts,
                archivedProducts,
                featuredProducts,
                trendingProducts,
                newArrivalProducts,
                totalViews: Number(productViews._sum.viewCount || 0),
            },
            recentOrders: recentOrders.map((order) => ({
                id: order.id,
                orderNumber: order.orderNumber,
                customerName: order.customerName,
                phone: order.phone,
                status: order.status,
                estimatedTotal: order.estimatedTotal === null ? null : Number(order.estimatedTotal),
                createdAt: order.createdAt,
            })),
            lowStockProducts,
            topProducts,
            categoryDistribution: categories.map((category) => ({
                categoryId: category.id,
                categoryName: category.name,
                productCount: category._count.products,
            })),
            monthlyProducts,
            monthlyOrders,
            notifications,
        };
    } catch (error) {
        throw error;
    }
};

export const DashboardService = {
    getDashboardOverview,
};
