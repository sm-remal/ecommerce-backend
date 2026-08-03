import { prisma } from "../../lib/prisma";
import type { OrderRequestWhereInput } from "../../generated/prisma/models/OrderRequest";
import type {
    CustomerReport,
    InventoryReport,
    OverviewReport,
    ProductReport,
    ReportQuery,
    RevenueMetric,
    SalesReport,
} from "./report.interface";
import { buildDateRangeWhere, getDateRange, getReportLimit, toCountMetrics } from "./report.validation";

const getRevenueMetric = async (where: OrderRequestWhereInput = {}): Promise<RevenueMetric> => {
    try {
        const [totalOrders, revenue, completedRevenue] = await Promise.all([
            prisma.orderRequest.count({ where }),
            prisma.orderRequest.aggregate({
                where,
                _sum: { estimatedTotal: true },
            }),
            prisma.orderRequest.aggregate({
                where: {
                    ...where,
                    status: "COMPLETED",
                },
                _sum: { estimatedTotal: true },
            }),
        ]);

        const totalRevenue = Number(revenue._sum?.estimatedTotal || 0);

        return {
            totalOrders,
            totalRevenue,
            completedRevenue: Number(completedRevenue._sum?.estimatedTotal || 0),
            averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
        };
    } catch (error) {
        throw error;
    }
};

const getOverviewReport = async (query: ReportQuery = {}): Promise<OverviewReport> => {
    try {
        const dateWhere = buildDateRangeWhere(query);

        const [
            products,
            publishedProducts,
            orders,
            users,
            reviews,
            pendingReviews,
            media,
            activeCoupons,
            revenue,
            inventoryStock,
            lowStockProducts,
            outOfStockProducts,
        ] = await Promise.all([
            prisma.product.count(),
            prisma.product.count({ where: { status: "PUBLISHED" } }),
            prisma.orderRequest.count({ where: dateWhere }),
            prisma.user.count(),
            prisma.review.count({ where: dateWhere }),
            prisma.review.count({ where: { ...dateWhere, status: false } }),
            prisma.media.count({ where: dateWhere }),
            prisma.coupon.count({
                where: {
                    status: true,
                    startDate: { lte: new Date() },
                    endDate: { gte: new Date() },
                },
            }),
            getRevenueMetric(dateWhere),
            prisma.inventory.aggregate({
                _sum: {
                    quantity: true,
                    reservedQuantity: true,
                },
            }),
            prisma.product.count({ where: { stockStatus: "LOW_STOCK" } }),
            prisma.product.count({ where: { stockStatus: "OUT_OF_STOCK" } }),
        ]);

        return {
            dateRange: getDateRange(query),
            totals: {
                products,
                publishedProducts,
                orders,
                users,
                reviews,
                pendingReviews,
                media,
                activeCoupons,
            },
            revenue,
            inventory: {
                totalStock: Number(inventoryStock._sum.quantity || 0),
                reservedStock: Number(inventoryStock._sum.reservedQuantity || 0),
                lowStockProducts,
                outOfStockProducts,
            },
        };
    } catch (error) {
        throw error;
    }
};

const getSalesReport = async (query: ReportQuery = {}): Promise<SalesReport> => {
    try {
        const limit = getReportLimit(query);
        const dateWhere = buildDateRangeWhere(query);

        const [revenue, statusRows, channelRows, orders, topProducts] = await Promise.all([
            getRevenueMetric(dateWhere),
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
            prisma.orderItem.groupBy({
                by: ["productId", "productName"],
                where: {
                    orderRequest: dateWhere,
                },
                _sum: {
                    quantity: true,
                    subtotal: true,
                },
                orderBy: {
                    _sum: {
                        subtotal: "desc",
                    },
                },
                take: limit,
            }),
        ]);

        const dailySales = Array.from(orders.reduce((map, order) => {
            const date = order.createdAt.toISOString().slice(0, 10);
            const current = map.get(date) || { date, orders: 0, revenue: 0 };
            current.orders += 1;
            current.revenue += Number(order.estimatedTotal || 0);
            map.set(date, current);

            return map;
        }, new Map<string, { date: string; orders: number; revenue: number }>()).values());

        return {
            dateRange: getDateRange(query),
            revenue,
            ordersByStatus: toCountMetrics(statusRows.map((row) => ({
                label: row.status,
                count: row._count.id,
            })), (row) => row.label),
            ordersByChannel: toCountMetrics(channelRows.map((row) => ({
                label: row.channel,
                count: row._count.id,
            })), (row) => row.label),
            dailySales,
            topProducts: topProducts.map((product) => ({
                productId: product.productId,
                productName: product.productName,
                quantity: Number(product._sum.quantity || 0),
                revenue: Number(product._sum.subtotal || 0),
            })),
        };
    } catch (error) {
        throw error;
    }
};

const getInventoryReport = async (query: ReportQuery = {}): Promise<InventoryReport> => {
    try {
        const limit = getReportLimit(query);
        const [products, stock, lowStockProducts, outOfStockProducts, lowStockItems] = await Promise.all([
            prisma.product.count(),
            prisma.inventory.aggregate({
                _sum: {
                    quantity: true,
                    reservedQuantity: true,
                },
            }),
            prisma.product.count({ where: { stockStatus: "LOW_STOCK" } }),
            prisma.product.count({ where: { stockStatus: "OUT_OF_STOCK" } }),
            prisma.product.findMany({
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
            }),
        ]);

        return {
            totals: {
                products,
                totalStock: Number(stock._sum.quantity || 0),
                reservedStock: Number(stock._sum.reservedQuantity || 0),
                lowStockProducts,
                outOfStockProducts,
            },
            lowStockItems: lowStockItems.map((product) => ({
                productId: product.id,
                name: product.name,
                sku: product.sku,
                stock: product.stock,
                lowStockThreshold: product.lowStockThreshold,
                stockStatus: product.stockStatus,
            })),
        };
    } catch (error) {
        throw error;
    }
};

const getProductReport = async (query: ReportQuery = {}): Promise<ProductReport> => {
    try {
        const limit = getReportLimit(query);
        const [
            products,
            publishedProducts,
            draftProducts,
            archivedProducts,
            featuredProducts,
            trendingProducts,
            newArrivalProducts,
            categories,
            brands,
            topViewedProducts,
            reviewedProducts,
        ] = await Promise.all([
            prisma.product.count(),
            prisma.product.count({ where: { status: "PUBLISHED" } }),
            prisma.product.count({ where: { status: "DRAFT" } }),
            prisma.product.count({ where: { status: "ARCHIVED" } }),
            prisma.product.count({ where: { isFeatured: true } }),
            prisma.product.count({ where: { isTrending: true } }),
            prisma.product.count({ where: { isNewArrival: true } }),
            prisma.category.findMany({
                select: {
                    name: true,
                    _count: { select: { products: true } },
                },
                orderBy: { name: "asc" },
            }),
            prisma.brand.findMany({
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
                    sku: true,
                    viewCount: true,
                },
                orderBy: { viewCount: "desc" },
                take: limit,
            }),
            prisma.review.groupBy({
                by: ["productId"],
                where: { status: true },
                _count: { id: true },
                _avg: { rating: true },
                orderBy: {
                    _count: {
                        id: "desc",
                    },
                },
                take: limit,
            }),
        ]);

        const reviewedProductIds = reviewedProducts.map((product) => product.productId);
        const reviewedProductDetails = reviewedProductIds.length
            ? await prisma.product.findMany({
                where: { id: { in: reviewedProductIds } },
                select: { id: true, name: true },
            })
            : [];
        const reviewedProductNameById = new Map(reviewedProductDetails.map((product) => [product.id, product.name]));

        return {
            totals: {
                products,
                publishedProducts,
                draftProducts,
                archivedProducts,
                featuredProducts,
                trendingProducts,
                newArrivalProducts,
            },
            productsByCategory: categories.map((category) => ({
                label: category.name,
                count: category._count.products,
            })),
            productsByBrand: brands.map((brand) => ({
                label: brand.name,
                count: brand._count.products,
            })),
            topViewedProducts,
            topReviewedProducts: reviewedProducts.map((product) => ({
                productId: product.productId,
                productName: reviewedProductNameById.get(product.productId) || "Unknown",
                totalReviews: product._count.id,
                averageRating: Number(product._avg.rating || 0),
            })),
        };
    } catch (error) {
        throw error;
    }
};

const getCustomerReport = async (query: ReportQuery = {}): Promise<CustomerReport> => {
    try {
        const limit = getReportLimit(query);
        const dateWhere = buildDateRangeWhere(query);
        const [users, activeUsers, inactiveUsers, suspendedUsers, newUsers, typeRows, statusRows, latestUsers] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { status: "ACTIVE" } }),
            prisma.user.count({ where: { status: "INACTIVE" } }),
            prisma.user.count({ where: { status: "SUSPENDED" } }),
            prisma.user.count({ where: dateWhere }),
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
            },
            usersByType: typeRows.map((row) => ({
                label: row.type,
                count: row._count.id,
            })),
            usersByStatus: statusRows.map((row) => ({
                label: row.status,
                count: row._count.id,
            })),
            latestUsers,
        };
    } catch (error) {
        throw error;
    }
};

export const ReportService = {
    getOverviewReport,
    getSalesReport,
    getInventoryReport,
    getProductReport,
    getCustomerReport,
};
