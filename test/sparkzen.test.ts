import { describe, expect, test, vi, beforeEach } from "vitest";

vi.mock("fastify", () => {
  const mockApp = {
    withTypeProvider: vi.fn(function () {
      //@ts-ignore
      return this;
    }),
    listen: vi.fn(),
    route: vi.fn(),
    setErrorHandler: vi.fn(),
  };
  return { default: vi.fn(() => mockApp) };
});

vi.mock("../src/core/functions/getConfig", () => ({ setConfig: vi.fn() }));
vi.mock("../src/core/functions/sparkzenBanner", () => ({ sparkzenBanner: vi.fn() }));
vi.mock("../src/core/functions/manageListen", () => ({ manageListen: vi.fn() }));
vi.mock("../src/core/functions/errorHandler", () => ({ errorHandler: vi.fn() }));
vi.mock("../src/core/loadRoutes", () => ({ loadRoutes: vi.fn() }));

import fastify from "fastify";
import { sparkzen } from "../src/core/sparkzen";
import { setConfig } from "../src/core/functions/getConfig";
import { loadRoutes } from "../src/core/loadRoutes";
import { manageListen } from "../src/core/functions/manageListen";
import { errorHandler } from "../src/core/functions/errorHandler";

describe("sparkzen()", () => {
  beforeEach(() => vi.clearAllMocks());

  test("should call setConfig() before anything else", async () => {
    await sparkzen();
    expect(setConfig).toHaveBeenCalledOnce();
  });

  test("should create a Fastify instance", async () => {
    await sparkzen();
    expect(fastify).toHaveBeenCalledOnce();
  });

  test("should apply TypeBox type provider", async () => {
    const app = await sparkzen();
    expect(app.withTypeProvider).toHaveBeenCalledOnce();
  });

  test("should call loadRoutes() with the app instance", async () => {
    const app = await sparkzen();
    expect(loadRoutes).toHaveBeenCalledOnce();
    expect(loadRoutes).toHaveBeenCalledWith(app);
  });

  test("should call manageListen() with the app instance", async () => {
    const app = await sparkzen();
    expect(manageListen).toHaveBeenCalledWith(app);
  });

  test("should register the error handler", async () => {
    const app = await sparkzen();
    expect(app.setErrorHandler).toHaveBeenCalledWith(errorHandler);
  });

  test("should return the app instance", async () => {
    const app = await sparkzen();
    expect(app).toHaveProperty("listen");
    expect(app).toHaveProperty("route");
    expect(app).toHaveProperty("setErrorHandler");
  });
});
