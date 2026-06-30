import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";
import {
  getRecentlyViewed,
  recordRecentlyViewed,
} from "../controllers/wishlist.controller";

const router = Router();

router.get("/recent", requireAuth, asyncHandler(getRecentlyViewed));
router.post("/recent/:propertyId", requireAuth, asyncHandler(recordRecentlyViewed));

export default router;
