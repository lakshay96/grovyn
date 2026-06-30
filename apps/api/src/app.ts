import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { env, isAllowedOrigin } from "./config/env";
import apiRoutes from "./routes";
import { apiLimiter } from "./middleware/rateLimit";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp(): Express {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));

  app.use(
    cors({
      origin(origin, cb) {
        cb(null, !origin || isAllowedOrigin(origin));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  if (!env.isProd) app.use(morgan("dev"));
  else app.use(morgan("combined"));

  app.get("/", (_req, res) => {
    res.json({ name: "Grovyn API", status: "ok", docs: "/api/health" });
  });

  app.use("/api", apiLimiter, apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
