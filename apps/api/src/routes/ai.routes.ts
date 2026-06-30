import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { optionalAuth } from "../middleware/auth";
import { aiLimiter } from "../middleware/rateLimit";
import { assistantSchema, summarizeSchema } from "../utils/schemas";
import { assistant, summarize } from "../controllers/ai.controller";

const router = Router();

router.post(
  "/assistant",
  aiLimiter,
  optionalAuth,
  validate(assistantSchema),
  asyncHandler(assistant)
);
router.post(
  "/summarize-reviews",
  aiLimiter,
  validate(summarizeSchema),
  asyncHandler(summarize)
);

export default router;
