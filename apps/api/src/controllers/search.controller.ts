import type { Request, Response } from "express";
import { hybridSearch, suggest, trending } from "../services/search.service";
import { logEvent } from "../services/analytics.service";

export async function search(req: Request, res: Response): Promise<void> {
  const q = String(req.query.q ?? "").trim();
  if (!q) {
    res.json({ items: [], suggestions: [] });
    return;
  }

  const [items, suggestions] = await Promise.all([hybridSearch(q, 12), suggest(q, 6)]);

  void logEvent("search", undefined, { q });

  res.json({ items, suggestions });
}

export async function searchSuggest(req: Request, res: Response): Promise<void> {
  const q = String(req.query.q ?? "").trim();
  const suggestions = await suggest(q, 8);
  res.json({ suggestions });
}

export async function searchTrending(_req: Request, res: Response): Promise<void> {
  const list = await trending(8);
  res.json({ trending: list });
}
