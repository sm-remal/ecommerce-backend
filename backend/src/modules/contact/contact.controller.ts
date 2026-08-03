import type { Request, Response } from "express";
import asyncHandler from "../../utility/asyncHandler";
import { AppError } from "../../utility/AppError";
import { responseMessages } from "../../utility/responseMessages";
import sendResponse from "../../utility/sendResponse";
import { ContactService } from "./contact.service";
import { parseContactSubmissionPayload } from "./contact.validation";

const getContactInfo = asyncHandler(async (req: Request, res: Response) => {
    const info = await ContactService.getContactInfo();

    sendResponse(res, 200, {
        success: true,
        message: responseMessages.contact.info,
        data: info,
    });
});

const submitContact = asyncHandler(async (req: Request, res: Response) => {
    const submission = await ContactService.submitContact(parseContactSubmissionPayload(req.body));

    sendResponse(res, 201, {
        success: true,
        message: responseMessages.contact.submitted,
        data: submission,
    });
});

export const ContactController = {
    getContactInfo,
    submitContact,
};
