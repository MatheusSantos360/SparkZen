import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("node:fs/promises", () => ({
  default: { readdir: vi.fn() },
}));
vi.mock("../../src/core/routing/dynamicImport", () => ({
  dynamicImport: vi.fn().mockResolvedValue({ handler: vi.fn() }),
}));
vi.mock("../../src/core/routing/isValidRoute", () => ({
  isValidRoute: vi.fn().mockReturnValue(true),
}));
vi.mock("../../src/core/routing/registerRoute", () => ({
  registerRoute: vi.fn(),
}));

import fs from "node:fs/promises";
import type { FastifyInstance } from "fastify";
import { loadRoutes } from "../../src/core/loadRoutes";
import { registerRoute } from "../../src/core/routing/registerRoute";

const app = {} as FastifyInstance;
const readdirMock = vi.mocked(fs.readdir);
const registerRouteMock = vi.mocked(registerRoute);

const makeFile = (name: string) => ({
  name,
  isDirectory: () => false,
  isFile: () => true,
});

const makeDir = (name: string) => ({
  name,
  isDirectory: () => true,
  isFile: () => false,
});

describe("loadRoutes()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = "development";
  });

  test("should call registerRoute for .ts files in dev", async () => {
    readdirMock.mockResolvedValue([makeFile("get.ts")] as any);
    await loadRoutes(app, "/fake/routes");
    expect(registerRouteMock).toHaveBeenCalledOnce();
  });

  test("should not call registerRoute for non-.ts files in dev", async () => {
    readdirMock.mockResolvedValue([makeFile("get.js")] as any);
    await loadRoutes(app, "/fake/routes");
    expect(registerRouteMock).not.toHaveBeenCalled();
  });

  test("should recurse into subdirectories", async () => {
    readdirMock.mockResolvedValueOnce([makeDir("users")] as any).mockResolvedValueOnce([makeFile("get.ts")] as any);
    await loadRoutes(app, "/fake/routes");
    expect(registerRouteMock).toHaveBeenCalledOnce();
  });

  test("should call registerRoute for .js files in production", async () => {
    process.env.NODE_ENV = "production";
    readdirMock.mockResolvedValue([makeFile("get.js")] as any);
    await loadRoutes(app, "/fake/routes");
    expect(registerRouteMock).toHaveBeenCalledOnce();
  });

  test("should pass the app instance to registerRoute", async () => {
    readdirMock.mockResolvedValue([makeFile("get.ts")] as any);
    await loadRoutes(app, "/fake/routes");
    expect(registerRouteMock).toHaveBeenCalledWith(app, expect.anything(), expect.any(String), expect.any(String));
  });
});
