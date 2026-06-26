import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";

const EchoBody = z.object({
  message: z.string().min(1).max(280),
});

const EchoResponse = z.object({
  message: z.string(),
  length: z.number().int(),
  receivedAt: z.string(),
});

/** Example POST route showing zod request-body validation + typed response. */
export async function echoRoutes(app: FastifyInstance): Promise<void> {
  const r = app.withTypeProvider<FastifyZodOpenApiTypeProvider>();

  r.post(
    "/echo",
    {
      schema: {
        summary: "Echo a message back",
        body: EchoBody,
        response: { 200: EchoResponse },
      },
    },
    async (request) => {
      const { message } = request.body;
      return {
        message,
        length: message.length,
        receivedAt: new Date().toISOString(),
      };
    },
  );
}
