import { Router } from "express";
import authRoutes from "./auth.routes";
import propertyRoutes from "./property.routes";
import searchRoutes from "./search.routes";
import wishlistRoutes from "./wishlist.routes";
import meRoutes from "./me.routes";
import recommendationRoutes from "./recommendation.routes";
import aiRoutes from "./ai.routes";
import inquiryRoutes from "./inquiry.routes";
import analyticsRoutes from "./analytics.routes";
import { isDbConnected } from "../config/db";

const api = Router();

api.get("/health", (_req, res) => {
  res.json({ ok: true, db: isDbConnected() ? "connected" : "disconnected" });
});

api.use("/auth", authRoutes);
api.use("/properties", propertyRoutes);
api.use("/search", searchRoutes);
api.use("/wishlist", wishlistRoutes);
api.use("/me", meRoutes);
api.use("/recommendations", recommendationRoutes);
api.use("/ai", aiRoutes);
api.use("/inquiries", inquiryRoutes);
api.use("/analytics", analyticsRoutes);

export default api;
