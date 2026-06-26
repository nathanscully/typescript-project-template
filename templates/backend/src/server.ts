import { buildApp } from "./app.ts";

const PORT = Number(process.env["PORT"] ?? 3000);
const HOST = process.env["HOST"] ?? "0.0.0.0";

const app = await buildApp();

try {
  await app.listen({ port: PORT, host: HOST });
  app.log.info(`docs available at http://localhost:${PORT}/docs`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

// Graceful shutdown so `node --watch` restarts and container stops are clean.
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    app.close().then(
      () => process.exit(0),
      () => process.exit(1),
    );
  });
}
