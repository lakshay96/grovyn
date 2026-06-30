import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { optionalAuth, requireAuth, requireRole } from "../middleware/auth";
import {
  createPropertySchema,
  propertyQuerySchema,
  updatePropertySchema,
} from "../utils/schemas";
import {
  createProperty,
  deleteProperty,
  getPropertyBySlug,
  listProperties,
  similarProperties,
  updateProperty,
} from "../controllers/property.controller";

const router = Router();

router.get("/", validate(propertyQuerySchema, "query"), asyncHandler(listProperties));
router.post(
  "/",
  requireAuth,
  requireRole("agent", "admin"),
  validate(createPropertySchema),
  asyncHandler(createProperty)
);

router.get("/:id/similar", asyncHandler(similarProperties));

router.put(
  "/:id",
  requireAuth,
  requireRole("agent", "admin"),
  validate(updatePropertySchema),
  asyncHandler(updateProperty)
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("agent", "admin"),
  asyncHandler(deleteProperty)
);

router.get("/:slug", optionalAuth, asyncHandler(getPropertyBySlug));

export default router;
