import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";
import { analyticsEventSchema } from "../utils/schemas";
import { ingestEvent, summary } from "../controllers/analytics.controller";

const router = Router();

router.get("/summary", requireAuth, requireRole("agent", "admin"), asyncHandler(summary));
router.post("/event", validate(analyticsEventSchema), asyncHandler(ingestEvent));

export default router;
