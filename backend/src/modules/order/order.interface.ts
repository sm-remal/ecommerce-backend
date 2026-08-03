export type OrderSource = "WHATSAPP" | "MESSENGER" | "EMAIL_FORM";

export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "COMPLETED" | "CANCELLED";

export type OrderItemInput = {
    productId?: string | null;
    productName?: string;
    unitPrice?: number;
    quantity?: number;
};

export type OrderItem = {
    id: string;
    orderRequestId: string;
    productId: string | null;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    product: {
        id: string;
        name: string;
        slug: string;
        sku: string;
    } | null;
};

export type OrderRequestItem = {
    id: string;
    orderNumber: string;
    customerName: string;
    phone: string;
    email: string | null;
    address: string;
    message: string | null;
    channel: OrderSource;
    status: OrderStatus;
    estimatedTotal: number | null;
    adminNote: string | null;
    createdAt: Date;
    updatedAt: Date;
    items: OrderItem[];
};

export type OrderListFilters = {
    search?: string;
    status?: OrderStatus;
    channel?: OrderSource;
    phone?: string;
    page?: number;
    limit?: number;
};

export type CreateOrderPayload = {
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    message?: string;
    channel: OrderSource;
    items: OrderItemInput[];
};

export type UpdateOrderPayload = Partial<Omit<CreateOrderPayload, "channel">> & {
    channel?: OrderSource;
    status?: OrderStatus;
    adminNote?: string | null;
    estimatedTotal?: number | null;
};

export type UpdateOrderStatusPayload = {
    status: OrderStatus;
    adminNote?: string | null;
};
