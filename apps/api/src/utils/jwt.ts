import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { AuthPrincipal } from "../types";

export function signToken(principal: AuthPrincipal): string {
  return jwt.sign(principal, env.jwtSecret, {
    algorithm: "HS256",
    expiresIn: env.jwtExpires as SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): AuthPrincipal {
  const decoded = jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });
  if (typeof decoded === "string") {
    throw new Error("Malformed token payload");
  }
  const { id, role, name, email } = decoded as Record<string, unknown>;
  if (!id || !role) throw new Error("Malformed token payload");
  return {
    id: String(id),
    role: role as AuthPrincipal["role"],
    name: String(name ?? ""),
    email: String(email ?? ""),
  };
}
