import { afterAll, beforeAll, expect, test } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "./app.ts";

let app: FastifyInstance;

beforeAll(async () => {
  // Quiet logger in tests; inject() drives routes without binding a port.
  app = await buildApp({ logger: false });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test("GET /health returns ok", async () => {
  const res = await app.inject({ method: "GET", url: "/health" });
  expect(res.statusCode).toBe(200);
  const body = res.json();
  expect(body.status).toBe("ok");
  expect(typeof body.uptime).toBe("number");
});

test("POST /echo echoes the message", async () => {
  const res = await app.inject({
    method: "POST",
    url: "/echo",
    payload: { message: "hello" },
  });
  expect(res.statusCode).toBe(200);
  const body = res.json();
  expect(body.message).toBe("hello");
  expect(body.length).toBe(5);
});

test("POST /echo rejects an empty message", async () => {
  const res = await app.inject({
    method: "POST",
    url: "/echo",
    payload: { message: "" },
  });
  expect(res.statusCode).toBe(400);
});
