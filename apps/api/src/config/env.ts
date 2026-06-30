import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";

const PLACEHOLDER_SECRET = "change-me-in-prod";
const rawSecret = process.env.JWT_SECRET || "";

if (isProd && (rawSecret.length < 32 || rawSecret === PLACEHOLDER_SECRET)) {
  throw new Error(
    "JWT_SECRET must be set to a strong value (at least 32 characters) in production."
  );
}

const jwtSecret =
  rawSecret && rawSecret !== PLACEHOLDER_SECRET
    ? rawSecret
    : "dev-insecure-secret-not-for-production-use-only";

export const env = {
  port: Number(process.env.PORT) || 5050,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/grovyn",
  jwtSecret,
  jwtExpires: process.env.JWT_EXPIRES || "7d",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  openAiKey: process.env.OPENAI_API_KEY || "",
  nodeEnv,
  isProd,
  debugErrors: process.env.DEBUG_ERRORS === "true",
};

export type Env = typeof env;

export function isAllowedOrigin(origin: string): boolean {
  const allowed = env.clientOrigin
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return (
    allowed.includes(origin) ||
    origin.endsWith(".vercel.app") ||
    /^https?:\/\/localhost(:\d+)?$/.test(origin)
  );
}
