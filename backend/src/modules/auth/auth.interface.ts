export type AuthUser = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    type: string;
    status: string;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    phone?: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type ForgotPasswordPayload = {
    email: string;
};

export type ResetPasswordPayload = {
    token: string;
    password: string;
};

export type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
};

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};

export type AuthResponse = AuthTokens & {
    user: AuthUser;
};
