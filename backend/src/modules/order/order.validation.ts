import { z } from "zod";
import { AppError } from "../../utility/AppError";
import type {
    CreateOrderPayload,
    OrderListFilters,
    OrderRequestItem,
    OrderSource,
    OrderStatus,
    UpdateOrderPayload,
    UpdateOrderStatusPayload,
} from "./order.interface";

type OrderRecord = {
    id: string;
    orderNumber: string;
    customerName: string;
    phone: string;
    email: string | null;
    address: string;
    message: string | null;
    channel: OrderSource;
    status: OrderStatus;
    estimatedTotal: unknown | null;
    adminNote: string | null;
    createdAt: Date;
    updatedAt: Date;
    items: {
        id: string;
        orderRequestId: string;
        productId: string | null;
        productName: string;
        unitPrice: unknown;
        quantity: number;
        subtotal: unknown;
        product: {
            id: string;
            name: string;
            slug: string;
            sku: string;
        } | null;
    }[];
};

const orderSources = ["WHATSAPP", "MESSENGER", "EMAIL_FORM"] as const;
const orderStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELLED"] as const;

const orderItemSchema = z.object({
    productId: z.union([z.string().trim().min(1), z.null()]).optional(),
    productName: z.string().trim().min(1).optional(),
    unitPrice: z.coerce.number().nonnegative().optional(),
    quantity: z.coerce.number().int().positive().optional(),
}).superRefine((item, context) => {
    if (!item.productId && (!item.productName || typeof item.unitPrice === "undefined")) {
        context.addIssue({
            code: "custom",
            message: "Order item requires productId or productName with unitPrice",
        });
    }
});

const createOrderSchema = z.object({
    customerName: z.string().trim().min(1),
    phone: z.string().trim().min(5),
    email: z.string().trim().email().optional(),
    address: z.string().trim().min(1),
    message: z.string().trim().optional(),
    channel: z.enum(orderSources),
    items: z.array(orderItemSchema).min(1),
});

const updateOrderSchema = createOrderSchema.partial().extend({
    status: z.enum(orderStatuses).optional(),
    adminNote: z.union([z.string().trim(), z.null()]).optional(),
    estimatedTotal: z.union([z.coerce.number().nonnegative(), z.null()]).optional(),
});

const updateOrderStatusSchema = z.object({
    status: z.enum(orderStatuses),
    adminNote: z.union([z.string().trim(), z.null()]).optional(),
});

const orderListQuerySchema = z.object({
    search: z.string().trim().optional(),
    status: z.enum(orderStatuses).optional(),
    channel: z.enum(orderSources).optional(),
    phone: z.string().trim().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
});

const formatZodMessage = (error: z.ZodError) => error.issues.map((issue) => issue.message).join(", ");

export const parseCreateOrderPayload = (payload: unknown): CreateOrderPayload => {
    try {
        const parsed = createOrderSchema.parse(payload);

        return {
            customerName: parsed.customerName,
            phone: parsed.phone,
            address: parsed.address,
            channel: parsed.channel,
            items: parsed.items.map((item) => ({
                ...(typeof item.productId !== "undefined" ? { productId: item.productId } : {}),
                ...(typeof item.productName !== "undefined" ? { productName: item.productName } : {}),
                ...(typeof item.unitPrice !== "undefined" ? { unitPrice: item.unitPrice } : {}),
                quantity: item.quantity || 1,
            })),
            ...(typeof parsed.email !== "undefined" ? { email: parsed.email } : {}),
            ...(typeof parsed.message !== "undefined" ? { message: parsed.message } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseUpdateOrderPayload = (payload: unknown): UpdateOrderPayload => {
    try {
        const parsed = updateOrderSchema.parse(payload);

        return {
            ...(typeof parsed.customerName !== "undefined" ? { customerName: parsed.customerName } : {}),
            ...(typeof parsed.phone !== "undefined" ? { phone: parsed.phone } : {}),
            ...(typeof parsed.email !== "undefined" ? { email: parsed.email } : {}),
            ...(typeof parsed.address !== "undefined" ? { address: parsed.address } : {}),
            ...(typeof parsed.message !== "undefined" ? { message: parsed.message } : {}),
            ...(typeof parsed.channel !== "undefined" ? { channel: parsed.channel } : {}),
            ...(typeof parsed.status !== "undefined" ? { status: parsed.status } : {}),
            ...(typeof parsed.adminNote !== "undefined" ? { adminNote: parsed.adminNote } : {}),
            ...(typeof parsed.estimatedTotal !== "undefined" ? { estimatedTotal: parsed.estimatedTotal } : {}),
            ...(typeof parsed.items !== "undefined" ? {
                items: parsed.items.map((item) => ({
                    ...(typeof item.productId !== "undefined" ? { productId: item.productId } : {}),
                    ...(typeof item.productName !== "undefined" ? { productName: item.productName } : {}),
                    ...(typeof item.unitPrice !== "undefined" ? { unitPrice: item.unitPrice } : {}),
                    quantity: item.quantity || 1,
                })),
            } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseUpdateOrderStatusPayload = (payload: unknown): UpdateOrderStatusPayload => {
    try {
        const parsed = updateOrderStatusSchema.parse(payload);

        return {
            status: parsed.status,
            ...(typeof parsed.adminNote !== "undefined" ? { adminNote: parsed.adminNote } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const parseOrderListFilters = (query: unknown): OrderListFilters => {
    try {
        const parsed = orderListQuerySchema.parse(query);

        return {
            ...(parsed.search ? { search: parsed.search } : {}),
            ...(parsed.status ? { status: parsed.status } : {}),
            ...(parsed.channel ? { channel: parsed.channel } : {}),
            ...(parsed.phone ? { phone: parsed.phone } : {}),
            ...(typeof parsed.page !== "undefined" ? { page: parsed.page } : {}),
            ...(typeof parsed.limit !== "undefined" ? { limit: parsed.limit } : {}),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, formatZodMessage(error));
        }

        throw error;
    }
};

export const orderInclude = {
    items: {
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    sku: true,
                },
            },
        },
    },
};

export const mapOrder = (order: OrderRecord | any): OrderRequestItem => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    phone: order.phone,
    email: order.email,
    address: order.address,
    message: order.message,
    channel: order.channel,
    status: order.status,
    estimatedTotal: order.estimatedTotal === null ? null : Number(order.estimatedTotal),
    adminNote: order.adminNote,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items.map((item: OrderRecord["items"][number]) => ({
        id: item.id,
        orderRequestId: item.orderRequestId,
        productId: item.productId,
        productName: item.productName,
        unitPrice: Number(item.unitPrice),
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
        product: item.product,
    })),
});

export const buildOrderWhereClause = (filters: OrderListFilters) => {
    const where: Record<string, unknown> = {};

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.channel) {
        where.channel = filters.channel;
    }

    if (filters.phone) {
        where.phone = { contains: filters.phone };
    }

    if (filters.search?.trim()) {
        const search = filters.search.trim();
        where.OR = [
            { orderNumber: { contains: search } },
            { customerName: { contains: search } },
            { phone: { contains: search } },
            { email: { contains: search } },
        ];
    }

    return where;
};
