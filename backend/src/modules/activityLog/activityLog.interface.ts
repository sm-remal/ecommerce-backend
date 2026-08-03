export type ActivityAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";

export type CreateActivityLogPayload = {
    adminId?: string | null;
    adminName?: string;
    action: ActivityAction;
    module: string;
    description: string;
    ipAddress?: string | null;
};

export type ActivityLogFilters = {
    search?: string;
    adminId?: string;
    action?: ActivityAction;
    module?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
};

export type ActivityLogItem = {
    id: string;
    adminId: string | null;
    adminName: string;
    action: ActivityAction;
    module: string;
    description: string;
    ipAddress: string | null;
    createdAt: Date;
    admin: {
        id: string;
        name: string;
        email: string;
    } | null;
};

export type ActivityLogListResponse = {
    items: ActivityLogItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPage: number;
    };
};
