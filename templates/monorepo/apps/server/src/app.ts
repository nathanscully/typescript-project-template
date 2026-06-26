import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify, { type FastifyInstance } from "fastify";
import {
  type FastifyZodOpenApiTypeProvider,
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  serializerCompiler,
  validatorCompiler,
} from "fastify-zod-openapi";

import { registerRoutes } from "./routes/index.ts";

export interface BuildAppOptions {
  /** Pass a fixed logger config; defaults to pretty in dev, JSON otherwise. */
  logger?: boolean;
}

/**
 * Builds the Fastify app with zod-openapi wired up. Exported separately from
 * `server.ts` so tests can drive it via `app.inject()` without binding a port.
 */
export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: options.logger ?? true,
  }).withTypeProvider<FastifyZodOpenApiTypeProvider>();

  // zod-openapi: validate requests and serialize responses from zod schemas.
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  await app.register(fastifyZodOpenApiPlugin);

  await app.register(fastifySwagger, {
    openapi: {
      info: { title: "backend", version: "0.0.0" },
    },
    transform: fastifyZodOpenApiTransform,
    transformObject: fastifyZodOpenApiTransformObject,
  });
  await app.register(fastifySwaggerUi, { routePrefix: "/docs" });

  await app.register(registerRoutes);

  return app;
}
