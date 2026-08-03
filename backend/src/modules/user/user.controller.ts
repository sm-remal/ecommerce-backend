import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { UserService } from "./user.service";
import {
    parseCreateUserPayload,
    parseUpdateProfilePayload,
    parseUpdateUserPayload,
    parseUserListFilters,
} from "./user.validation";

type AuthenticatedRequest = Request & {
    user?: {
        id: string;
        email: string;
    };
};

const getParamValue = (value: unknown) => typeof value === "string" ? value : undefined;

const requireUserId = (req: AuthenticatedRequest) => {
    if (!req.user?.id) {
        throw new AppError(401, responseMessages.common.unauthorized);
    }

    return req.user.id;
};

const createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.createUser(parseCreateUserPayload(req.body));

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.user.created,
        data: user,
    });
});

const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await UserService.getUsers(parseUserListFilters(req.query));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.user.listed,
        data: users,
    });
});

const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const user = await UserService.getUserById(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.user.found,
        data: user,
    });
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const user = await UserService.updateUser(id, parseUpdateUserPayload(req.body));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.user.updated,
        data: user,
    });
});

const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await UserService.getProfile(requireUserId(req));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.user.found,
        data: user,
    });
});

const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await UserService.updateProfile(requireUserId(req), parseUpdateProfilePayload(req.body));

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.user.updated,
        data: user,
    });
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const id = getParamValue(req.params.id);
    if (!id) {
        throw new AppError(400, responseMessages.common.invalidInput);
    }

    const user = await UserService.deleteUser(id);

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.user.deleted,
        data: user,
    });
});

export const UserController = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    getProfile,
    updateProfile,
    deleteUser,
};
