import type { Request } from "express";
import { ActivityLogService } from "../modules/activityLog/activityLog.service";
import type { ActivityAction } from "../modules/activityLog/activityLog.interface";

type AuditableRequest = Request & {
    user?: {
        id: string;
        email: string;
    };
};

type AuditLogOptions = {
    req: AuditableRequest;
    action: ActivityAction;
    module: string;
    description: string;
};

export const writeAuditLog = async ({ req, action, module, description }: AuditLogOptions) => {
    try {
        await ActivityLogService.createActivityLog({
            adminId: req.user?.id || null,
            adminName: req.user?.email || "System",
            action,
            module,
            description,
            ipAddress: req.ip || null,
        });
    } catch (error) {
        console.error("Audit log write failed", error);
    }
};
