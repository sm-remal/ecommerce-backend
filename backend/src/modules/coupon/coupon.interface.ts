export type CouponType = "PERCENTAGE" | "FIXED";

export type CouponItem = {
    id: string;
    code: string;
    type: CouponType;
    value: number;
    minOrderAmount: number | null;
    maxDiscountAmount: number | null;
    usageLimit: number | null;
    usedCount: number;
    startDate: Date;
    endDate: Date;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type CouponListFilters = {
    search?: string;
    type?: CouponType;
    status?: boolean;
    activeNow?: boolean;
    page?: number;
    limit?: number;
};

export type CreateCouponPayload = {
    code: string;
    type: CouponType;
    value: number;
    minOrderAmount?: number | null;
    maxDiscountAmount?: number | null;
    usageLimit?: number | null;
    usedCount?: number;
    startDate: string | Date;
    endDate: string | Date;
    status?: boolean;
};

export type UpdateCouponPayload = Partial<CreateCouponPayload>;

export type ValidateCouponPayload = {
    code: string;
    orderAmount?: number;
};

export type CouponValidationResult = {
    coupon: CouponItem;
    isValid: boolean;
    discountAmount: number | null;
    message: string;
};
