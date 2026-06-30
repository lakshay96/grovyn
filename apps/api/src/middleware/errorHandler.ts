import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export function notFoundHandler(req: Request, res: Response): void {
  res
    .status(404)
    .json({ error: { message: `Route not found: ${req.method} ${req.path}`, code: "NOT_FOUND" } });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  let status = 500;
  let message = "Internal server error";
  let code: string | undefined = "INTERNAL";
  let safeMessage = false;

  if (err instanceof ApiError) {
    status = err.status;
    message = err.message;
    code = err.code;
    safeMessage = true;
  } else if (err instanceof ZodError) {
    status = 400;
    code = "VALIDATION";
    message = err.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; ");
    safeMessage = true;
  } else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    code = "VALIDATION";
    message = Object.values(err.errors).map((e) => e.message).join("; ");
    safeMessage = true;
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    code = "BAD_ID";
    message = `Invalid value for ${err.path}`;
    safeMessage = true;
  } else if (isDuplicateKey(err)) {
    status = 409;
    code = "DUPLICATE";
    message = "A record with that unique value already exists";
    safeMessage = true;
  } else if (isMongoUnavailable(err)) {
    status = 503;
    code = "DB_UNAVAILABLE";
    message = "Database is unavailable. Please try again shortly.";
    safeMessage = true;
  }

  if (status >= 500 && !safeMessage) {
    message = "Internal server error";
    code = "INTERNAL";
  }

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error("[error]", err);
  }

  const body: { error: { message: string; code?: string; stack?: string } } = {
    error: { message, code },
  };
  if (env.debugErrors && err instanceof Error) body.error.stack = err.stack;

  res.status(status).json(body);
}

function isDuplicateKey(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: number }).code === 11000
  );
}

function isMongoUnavailable(err: unknown): boolean {
  const name = (err as { name?: string })?.name ?? "";
  return (
    name === "MongooseServerSelectionError" ||
    name === "MongoNetworkError" ||
    name === "MongoServerSelectionError"
  );
}
