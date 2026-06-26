import type { FastifyInstance } from "fastify";

import { healthRoutes } from "./health.ts";
import { echoRoutes } from "./echo.ts";

/** Aggregates feature route plugins. Add new route modules here. */
export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await app.register(healthRoutes);
  await app.register(echoRoutes);
}
