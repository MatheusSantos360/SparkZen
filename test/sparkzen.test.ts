import { describe, expect, test, vi } from "vitest";

vi.mock("fastify", () => {
  const fastifyMock = vi.fn(() => ({
    listen: vi.fn(),
    route: vi.fn(),
    withTypeProvider: vi.fn(function () {
      //@ts-ignore
      return this;
    }),
  }));
  return { default: fastifyMock };
});

vi.mock("../src/core/loadRoutes.ts", () => {
  return {
    loadRoutes: vi.fn(async () => {}),
  }
})

import fastify from "fastify";
import sparkzen from "../src";
import { loadRoutes } from "../src/core/loadRoutes";

describe("sparkzen", () => {
  test("should created a Fastify instance", async () => {
    await sparkzen();
    expect(fastify).toHaveBeenCalledOnce();
  });

  test("should use TypeBox type provider", async () => {
    const app = await sparkzen();
    expect(app.withTypeProvider).toHaveBeenCalledOnce();
  });

  test("should call loadRoutes()", async () => {
    const app = await sparkzen();
    expect(loadRoutes).toHaveBeenCalledWith(app);
  });

  test("should return the SparkZen instance", async () => {
    const app = await sparkzen();
    expect(app).toHaveProperty("listen");
    expect(app).toHaveProperty("route");
  });
});
