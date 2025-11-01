import { vi, expect, test, describe } from "vitest";

vi.mock("fastify", () => {
  return {
    default: vi.fn(() => ({ listen() {}, route() {} })),
  };
});

import fastify from "fastify";
import sparkzen from "../src";

describe("sparkzen", () => {
  test("should created a Fastify instance", () => {
    sparkzen();
    expect(fastify).toHaveBeenCalledOnce();
  });

  test("should return the SparkZen instance", () => {
    const app = sparkzen();
    expect(app).toHaveProperty("listen");
    expect(app).toHaveProperty("route");
  });
});