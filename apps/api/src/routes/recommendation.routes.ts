import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { optionalAuth } from "../middleware/auth";
import { getRecommendations } from "../controllers/recommendation.controller";

const router = Router();

router.get("/", optionalAuth, asyncHandler(getRecommendations));

export default router;
