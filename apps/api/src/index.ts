import { createServer } from "http";
import { createApp } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { initSockets } from "./sockets";

async function main(): Promise<void> {
  const app = createApp();
  const httpServer = createServer(app);

  initSockets(httpServer);

  httpServer.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Grovyn API listening on http://localhost:${env.port}`);
    // eslint-disable-next-line no-console
    console.log(`   CORS / Socket origin: ${env.clientOrigin}`);
    // eslint-disable-next-line no-console
    console.log(`   AI mode: ${env.openAiKey ? "OpenAI (gpt-4o-mini)" : "local heuristic"}`);
  });

  connectDB().catch(() => undefined);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal startup error:", err);
  process.exit(1);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    // eslint-disable-next-line no-console
    console.log(`\n${signal} received — shutting down.`);
    process.exit(0);
  });
}
