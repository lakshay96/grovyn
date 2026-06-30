import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";
import {
  getWishlist,
  toggleWishlist,
} from "../controllers/wishlist.controller";

const router = Router();

router.get("/", requireAuth, asyncHandler(getWishlist));
router.post("/:propertyId", requireAuth, asyncHandler(toggleWishlist));

export default router;
