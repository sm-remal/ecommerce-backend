import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import type {
    ActivityLogFilters,
    CreateActivityLogPayload,
} from "./activityLog.interface";
import {
    activityLogInclude,
    buildActivityLogPagination,
    buildActivityLogWhereClause,
    mapActivityLog,
} from "./activityLog.validation";

const getAdminName = async (adminId?: string | null, fallbackName?: string) => {
    try {
        if (!adminId) {
            return fallbackName?.trim() || "System";
        }

        const admin = await prisma.user.findUnique({
            where: { id: adminId },
            select: { name: true, email: true },
        });

        return admin?.name || fallbackName?.trim() || admin?.email || "Unknown Admin";
    } catch (error) {
        throw error;
    }
};

const createActivityLog = async (payload: CreateActivityLogPayload) => {
    try {
        const adminName = await getAdminName(payload.adminId, payload.adminName);

        const log = await prisma.activityLog.create({
            data: {
                adminId: payload.adminId || null,
                adminName,
                action: payload.action,
                module: payload.module.trim(),
                description: payload.description.trim(),
                ipAddress: payload.ipAddress?.trim() || null,
            },
            include: activityLogInclude,
        });

        return mapActivityLog(log);
    } catch (error) {
        throw error;
    }
};

const getActivityLogs = async (filters: ActivityLogFilters = {}) => {
    try {
        const where = buildActivityLogWhereClause(filters);
        const { page, limit, skip } = buildActivityLogPagination(filters);

        const [logs, total] = await Promise.all([
            prisma.activityLog.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
                include: activityLogInclude,
            }),
            prisma.activityLog.count({ where }),
        ]);

        return {
            items: logs.map((log) => mapActivityLog(log)),
            meta: {
                total,
                page,
                limit,
                totalPage: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        throw error;
    }
};

const getActivityLogById = async (id: string) => {
    try {
        const log = await prisma.activityLog.findUnique({
            where: { id },
            include: activityLogInclude,
        });

        if (!log) {
            throw new AppError(404, responseMessages.common.notFound);
        }

        return mapActivityLog(log);
    } catch (error) {
        throw error;
    }
};

const deleteActivityLog = async (id: string) => {
    try {
        await getActivityLogById(id);

        const deletedLog = await prisma.activityLog.delete({
            where: { id },
        });

        return {
            id: deletedLog.id,
            module: deletedLog.module,
            action: deletedLog.action,
        };
    } catch (error) {
        throw error;
    }
};

export const ActivityLogService = {
    createActivityLog,
    getActivityLogs,
    getActivityLogById,
    deleteActivityLog,
};
