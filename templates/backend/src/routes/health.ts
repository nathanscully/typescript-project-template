import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";

const HealthResponse = z.object({
  status: z.literal("ok"),
  uptime: z.number().describe("Process uptime in seconds"),
});

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  const r = app.withTypeProvider<FastifyZodOpenApiTypeProvider>();

  r.get(
    "/health",
    {
      schema: {
        summary: "Liveness probe",
        response: { 200: HealthResponse },
      },
    },
    async () => ({ status: "ok" as const, uptime: process.uptime() }),
  );
}
