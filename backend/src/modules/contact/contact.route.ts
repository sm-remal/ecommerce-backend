import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { ContactController } from "./contact.controller";
import { parseContactSubmissionPayload } from "./contact.validation";

const router = Router();

router.get("/info", ContactController.getContactInfo);
router.post("/submit", validateRequest({ body: parseContactSubmissionPayload }), ContactController.submitContact);

export const ContactRoutes = router;
