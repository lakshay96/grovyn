import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  search,
  searchSuggest,
  searchTrending,
} from "../controllers/search.controller";

const router = Router();

router.get("/suggest", asyncHandler(searchSuggest));
router.get("/trending", asyncHandler(searchTrending));
router.get("/", asyncHandler(search));

export default router;
