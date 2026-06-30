import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { optionalAuth, requireAuth, requireRole } from "../middleware/auth";
import { inquirySchema } from "../utils/schemas";
import {
  createInquiry,
  listInquiries,
} from "../controllers/inquiry.controller";

const router = Router();

router.post("/", optionalAuth, validate(inquirySchema), asyncHandler(createInquiry));
router.get("/", requireAuth, requireRole("agent", "admin"), asyncHandler(listInquiries));

export default router;
