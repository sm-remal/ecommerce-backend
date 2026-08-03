import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { buildPagination, buildPaginationMeta } from "../../utility/pagination";
import { responseMessages } from "../../utility/responseMessages";
import type {
    CouponListFilters,
    CreateCouponPayload,
    UpdateCouponPayload,
    ValidateCouponPayload,
} from "./coupon.interface";
import {
    buildCouponWhereClause,
    buildCreateCouponData,
    buildUpdateCouponData,
    mapCoupon,
} from "./coupon.validation";

const ensureCouponCodeIsUnique = async (code: string, excludeId?: string) => {
    try {
        const existingCoupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
            select: { id: true },
        });

        if (existingCoupon && existingCoupon.id !== excludeId) {
            throw new AppError(409, "Coupon code already exists");
        }
    } catch (error) {
        throw error;
    }
};

const assertCouponUsable = (coupon: ReturnType<typeof mapCoupon>, orderAmount?: number) => {
    const now = new Date();

    if (!coupon.status) {
        throw new AppError(400, "Coupon is inactive");
    }

    if (coupon.startDate > now) {
        throw new AppError(400, "Coupon is not active yet");
    }

    if (coupon.endDate < now) {
        throw new AppError(400, "Coupon has expired");
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        throw new AppError(400, "Coupon usage limit reached");
    }

    if (
        typeof orderAmount !== "undefined"
        && coupon.minOrderAmount !== null
        && orderAmount < coupon.minOrderAmount
    ) {
        throw new AppError(400, `Minimum order amount is ${coupon.minOrderAmount}`);
    }
};

const calculateDiscountAmount = (coupon: ReturnType<typeof mapCoupon>, orderAmount?: number) => {
    if (typeof orderAmount === "undefined") {
        return null;
    }

    const rawDiscount = coupon.type === "PERCENTAGE"
        ? (orderAmount * coupon.value) / 100
        : coupon.value;

    const cappedDiscount = coupon.maxDiscountAmount === null
        ? rawDiscount
        : Math.min(rawDiscount, coupon.maxDiscountAmount);

    return Math.min(cappedDiscount, orderAmount);
};

const createCoupon = async (payload: CreateCouponPayload) => {
    try {
        await ensureCouponCodeIsUnique(payload.code);

        const coupon = await prisma.coupon.create({
            data: buildCreateCouponData(payload),
        });

        return mapCoupon(coupon);
    } catch (error) {
        throw error;
    }
};

const getCoupons = async (filters: CouponListFilters = {}) => {
    try {
        const where = buildCouponWhereClause(filters);
        const { page, limit, skip } = buildPagination(filters);
        const [coupons, total] = await Promise.all([
            prisma.coupon.findMany({
                where,
                orderBy: [
                    { createdAt: "desc" },
                ],
                skip,
                take: limit,
            }),
            prisma.coupon.count({ where }),
        ]);

        return {
            items: coupons.map((coupon) => mapCoupon(coupon)),
            total,
            meta: buildPaginationMeta(total, page, limit),
        };
    } catch (error) {
        throw error;
    }
};

const getCouponById = async (id: string) => {
    try {
        const coupon = await prisma.coupon.findUnique({
            where: { id },
        });

        if (!coupon) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapCoupon(coupon);
    } catch (error) {
        throw error;
    }
};

const getCouponByCode = async (code: string) => {
    try {
        const coupon = await prisma.coupon.findUnique({
            where: { code: code.trim().toUpperCase() },
        });

        if (!coupon) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapCoupon(coupon);
    } catch (error) {
        throw error;
    }
};

const validateCoupon = async (payload: ValidateCouponPayload) => {
    try {
        const coupon = await getCouponByCode(payload.code);
        assertCouponUsable(coupon, payload.orderAmount);

        return {
            coupon,
            isValid: true,
            discountAmount: calculateDiscountAmount(coupon, payload.orderAmount),
            message: "Coupon is valid",
        };
    } catch (error) {
        throw error;
    }
};

const updateCoupon = async (id: string, payload: UpdateCouponPayload) => {
    try {
        await getCouponById(id);

        if (payload.code) {
            await ensureCouponCodeIsUnique(payload.code, id);
        }

        const coupon = await prisma.coupon.update({
            where: { id },
            data: buildUpdateCouponData(payload),
        });

        return mapCoupon(coupon);
    } catch (error) {
        throw error;
    }
};

const useCoupon = async (id: string) => {
    try {
        const coupon = await getCouponById(id);
        assertCouponUsable(coupon);

        const updatedCoupon = await prisma.coupon.update({
            where: { id },
            data: {
                usedCount: {
                    increment: 1,
                },
            },
        });

        return mapCoupon(updatedCoupon);
    } catch (error) {
        throw error;
    }
};

const deleteCoupon = async (id: string) => {
    try {
        await getCouponById(id);

        const deletedCoupon = await prisma.coupon.delete({
            where: { id },
        });

        return {
            id: deletedCoupon.id,
            code: deletedCoupon.code,
        };
    } catch (error) {
        throw error;
    }
};

export const CouponService = {
    createCoupon,
    getCoupons,
    getCouponById,
    getCouponByCode,
    validateCoupon,
    updateCoupon,
    useCoupon,
    deleteCoupon,
};
