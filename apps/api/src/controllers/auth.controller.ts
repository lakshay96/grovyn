import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models";
import { signToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import type { AuthPrincipal } from "../types";

function toPrincipal(u: {
  _id: { toString(): string };
  role: AuthPrincipal["role"];
  name: string;
  email: string;
}): AuthPrincipal {
  return { id: u._id.toString(), role: u.role, name: u.name, email: u.email };
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const existing = await User.findOne({ email: email.toLowerCase() }).exec();
  if (existing) throw ApiError.conflict("Email is already registered", "EMAIL_TAKEN");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  const token = signToken(toPrincipal(user));
  res.status(201).json({ user: user.toJSON(), token });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  const user = await User.findOne({ email: email.toLowerCase() }).exec();
  if (!user) throw ApiError.unauthorized("Invalid credentials", "BAD_CREDENTIALS");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw ApiError.unauthorized("Invalid credentials", "BAD_CREDENTIALS");

  const token = signToken(toPrincipal(user));
  res.json({ user: user.toJSON(), token });
}

export async function me(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const user = await User.findById(req.user.id).exec();
  if (!user) throw ApiError.notFound("User not found");
  res.json({ user: user.toJSON() });
}
