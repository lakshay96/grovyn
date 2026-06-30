import type { Request, Response } from "express";
import { runAssistant, summarizeReviews } from "../services/ai.service";
import { ApiError } from "../utils/ApiError";
import type { ChatTurn } from "../types";

export async function assistant(req: Request, res: Response): Promise<void> {
  const { messages, context } = req.body as {
    messages: ChatTurn[];
    context?: { propertyId?: string };
  };
  const result = await runAssistant(messages, context);
  res.json(result);
}

export async function summarize(req: Request, res: Response): Promise<void> {
  const { propertyId } = req.body as { propertyId: string };
  try {
    const summary = await summarizeReviews(propertyId);
    res.json({ summary });
  } catch (err) {
    if (err instanceof Error && err.message === "Property not found") {
      throw ApiError.notFound("Property not found");
    }
    throw err;
  }
}
