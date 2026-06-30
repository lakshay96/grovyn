import type { Request, Response } from "express";
import { recommendFor } from "../services/recommendation.service";

export async function getRecommendations(req: Request, res: Response): Promise<void> {
  const { items, reason } = await recommendFor(req.user?.id, 8);
  res.json({ items, reason });
}
