export type UserRole = "USER" | "ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type UserItem = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    type: UserRole;
    status: UserStatus;
    emailVerifiedAt: Date | null;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export type UserListFilters = {
    search?: string;
    type?: UserRole;
    status?: UserStatus;
    page?: number;
    limit?: number;
};

export type CreateUserPayload = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    avatar?: string;
    type?: UserRole;
    status?: UserStatus;
};

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, "password">> & {
    password?: string;
};

export type UpdateProfilePayload = {
    name?: string;
    phone?: string;
    avatar?: string;
};
