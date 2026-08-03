import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import { responseMessages } from "../../utility/responseMessages";
import type {
    CreateOrderPayload,
    OrderItemInput,
    OrderListFilters,
    UpdateOrderPayload,
    UpdateOrderStatusPayload,
} from "./order.interface";
import {
    buildOrderWhereClause,
    mapOrder,
    orderInclude,
} from "./order.validation";

type PreparedOrderItem = {
    productId: string | null;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
};

const generateOrderNumber = () => `PGS-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

const getUniqueOrderNumber = async () => {
    try {
        while (true) {
            const orderNumber = generateOrderNumber();
            const existingOrder = await prisma.orderRequest.findUnique({
                where: { orderNumber },
                select: { id: true },
            });

            if (!existingOrder) {
                return orderNumber;
            }
        }
    } catch (error) {
        throw error;
    }
};

const prepareOrderItems = async (items: OrderItemInput[]): Promise<PreparedOrderItem[]> => {
    try {
        const preparedItems: PreparedOrderItem[] = [];

        for (const item of items) {
            const quantity = item.quantity || 1;

            if (item.productId) {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        salePrice: true,
                    },
                });

                if (!product) {
                    throw new AppError(404, "One or more ordered products were not found");
                }

                const unitPrice = Number(product.salePrice ?? product.price);

                preparedItems.push({
                    productId: product.id,
                    productName: product.name,
                    unitPrice,
                    quantity,
                    subtotal: unitPrice * quantity,
                });

                continue;
            }

            const unitPrice = Number(item.unitPrice);
            if (!item.productName || !Number.isFinite(unitPrice)) {
                throw new AppError(400, "Manual order item requires product name and unit price");
            }

            preparedItems.push({
                productId: null,
                productName: item.productName,
                unitPrice,
                quantity,
                subtotal: unitPrice * quantity,
            });
        }

        return preparedItems;
    } catch (error) {
        throw error;
    }
};

const calculateEstimatedTotal = (items: PreparedOrderItem[]) => items.reduce((total, item) => total + item.subtotal, 0);

const createOrder = async (payload: CreateOrderPayload) => {
    try {
        const orderNumber = await getUniqueOrderNumber();
        const items = await prepareOrderItems(payload.items);
        const estimatedTotal = calculateEstimatedTotal(items);

        const order = await prisma.orderRequest.create({
            data: {
                orderNumber,
                customerName: payload.customerName.trim(),
                phone: payload.phone.trim(),
                email: payload.email?.trim() || null,
                address: payload.address.trim(),
                message: payload.message?.trim() || null,
                channel: payload.channel,
                estimatedTotal,
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        productName: item.productName,
                        unitPrice: item.unitPrice,
                        quantity: item.quantity,
                        subtotal: item.subtotal,
                    })),
                },
            },
            include: orderInclude,
        });

        return mapOrder(order);
    } catch (error) {
        throw error;
    }
};

const getOrders = async (filters: OrderListFilters = {}) => {
    try {
        const where = buildOrderWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);
        const [orders, total] = await Promise.all([
            prisma.orderRequest.findMany({
                where,
                orderBy: [
                    { createdAt: "desc" },
                ],
                skip,
                take: limit,
                include: orderInclude,
            }),
            prisma.orderRequest.count({ where }),
        ]);

        return {
            items: orders.map((order) => mapOrder(order)),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getOrderById = async (id: string) => {
    try {
        const order = await prisma.orderRequest.findUnique({
            where: { id },
            include: orderInclude,
        });

        if (!order) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapOrder(order);
    } catch (error) {
        throw error;
    }
};

const getOrderByNumber = async (orderNumber: string) => {
    try {
        const order = await prisma.orderRequest.findUnique({
            where: { orderNumber },
            include: orderInclude,
        });

        if (!order) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapOrder(order);
    } catch (error) {
        throw error;
    }
};

const updateOrder = async (id: string, payload: UpdateOrderPayload) => {
    try {
        await getOrderById(id);

        const preparedItems = typeof payload.items === "undefined"
            ? undefined
            : await prepareOrderItems(payload.items);
        const estimatedTotal = preparedItems
            ? calculateEstimatedTotal(preparedItems)
            : payload.estimatedTotal;

        const order = await prisma.$transaction(async (tx) => {
            if (preparedItems) {
                await tx.orderItem.deleteMany({
                    where: { orderRequestId: id },
                });
            }

            return tx.orderRequest.update({
                where: { id },
                data: {
                    ...(typeof payload.customerName !== "undefined" ? { customerName: payload.customerName.trim() } : {}),
                    ...(typeof payload.phone !== "undefined" ? { phone: payload.phone.trim() } : {}),
                    ...(typeof payload.email !== "undefined" ? { email: payload.email?.trim() || null } : {}),
                    ...(typeof payload.address !== "undefined" ? { address: payload.address.trim() } : {}),
                    ...(typeof payload.message !== "undefined" ? { message: payload.message?.trim() || null } : {}),
                    ...(typeof payload.channel !== "undefined" ? { channel: payload.channel } : {}),
                    ...(typeof payload.status !== "undefined" ? { status: payload.status } : {}),
                    ...(typeof payload.adminNote !== "undefined" ? { adminNote: payload.adminNote?.trim() || null } : {}),
                    ...(typeof estimatedTotal !== "undefined" ? { estimatedTotal } : {}),
                    ...(preparedItems ? {
                        items: {
                            create: preparedItems.map((item) => ({
                                productId: item.productId,
                                productName: item.productName,
                                unitPrice: item.unitPrice,
                                quantity: item.quantity,
                                subtotal: item.subtotal,
                            })),
                        },
                    } : {}),
                },
                include: orderInclude,
            });
        });

        return mapOrder(order);
    } catch (error) {
        throw error;
    }
};

const updateOrderStatus = async (id: string, payload: UpdateOrderStatusPayload) => {
    try {
        await getOrderById(id);

        const order = await prisma.orderRequest.update({
            where: { id },
            data: {
                status: payload.status,
                ...(typeof payload.adminNote !== "undefined" ? { adminNote: payload.adminNote?.trim() || null } : {}),
            },
            include: orderInclude,
        });

        return mapOrder(order);
    } catch (error) {
        throw error;
    }
};

const deleteOrder = async (id: string) => {
    try {
        await getOrderById(id);

        const deletedOrder = await prisma.orderRequest.delete({
            where: { id },
        });

        return {
            id: deletedOrder.id,
            orderNumber: deletedOrder.orderNumber,
        };
    } catch (error) {
        throw error;
    }
};

export const OrderService = {
    createOrder,
    getOrders,
    getOrderById,
    getOrderByNumber,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
};
