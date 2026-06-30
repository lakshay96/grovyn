import mongoose from "mongoose";
import { env } from "./env";

let connecting: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (connecting) return connecting;

  mongoose.set("strictQuery", true);

  connecting = mongoose
    .connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(async (m) => {
      // eslint-disable-next-line no-console
      console.log("MongoDB connected");
      await Promise.all(
        Object.values(mongoose.models).map((mdl) => mdl.syncIndexes().catch(() => undefined))
      );
      return m;
    })
    .catch((err) => {
      connecting = null;
      // eslint-disable-next-line no-console
      console.warn(
        `MongoDB connection failed (${err?.message ?? err}). ` +
          "The server is still running; DB-backed routes will error until Mongo is reachable."
      );
      throw err;
    });

  return connecting;
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
