import fastify from "fastify";
import { describe, expect, test, vi } from "vitest";
import { loadRoutes } from "../src/core/loadRoutes";
import fs from "fs/promises";
import * as registerRoute from "../src/core/routing/registerRoute";
import * as dynamicImport from "../src/core/routing/dynamicImport";
import * as isValidRoute from "../src/core/routing/isValidRoute";

describe("loadRoutes", () => {
  test("should read the routes directory", async () => {
    const readdirSpy = vi.spyOn(fs, "readdir").mockResolvedValueOnce([]);
    const app = fastify();

    await loadRoutes(app);

    expect(readdirSpy).toHaveBeenCalledOnce();
  });

  test("should call loadRoutes recursively for directories", async () => {
    const readdirSpy = vi
      .spyOn(fs, "readdir")
      .mockResolvedValueOnce([{ name: "subdir", isDirectory: () => true, isFile: () => false } as any])
      .mockResolvedValueOnce([]);

    const app = fastify();
    await loadRoutes(app);

    expect(readdirSpy).toHaveBeenCalled();
  });

  test("should call loadRoutes recursively for nested directories", async () => {
    const readdirSpy = vi
      .spyOn(fs, "readdir")
      .mockResolvedValueOnce([{ name: "subdir", isDirectory: () => true, isFile: () => false } as any])
      .mockResolvedValueOnce([]);

    const app = fastify();
    await loadRoutes(app);
    expect(readdirSpy).toHaveBeenCalled();
  });

  test("should import valid route modules and register them", async () => {
    const registerRouteSpy = vi.spyOn(registerRoute, "registerRoute").mockImplementation(() => { });
    vi.spyOn(fs, "readdir")
      .mockResolvedValueOnce([{ name: "subdir", isDirectory: () => true, isFile: () => false } as any])
      .mockResolvedValueOnce([{ name: "get.ts", isDirectory: () => false, isFile: () => true } as any]);
    vi.spyOn(dynamicImport, "dynamicImport").mockResolvedValueOnce({ default: {} });
    vi.spyOn(isValidRoute, "isValidRoute").mockReturnValueOnce(true);

    const app = fastify();
    await loadRoutes(app, "test/routes");

    expect(registerRouteSpy).toHaveBeenCalled();
  });

  test("should warn for invalid route modules", async () => {
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => { });
    vi.spyOn(fs, "readdir")
      .mockResolvedValueOnce([{ name: "subdir", isDirectory: () => true, isFile: () => false } as any])
      .mockResolvedValueOnce([{ name: "get.ts", isDirectory: () => false, isFile: () => true } as any]);
    vi.spyOn(dynamicImport, "dynamicImport").mockResolvedValueOnce({ default: {} });
    vi.spyOn(isValidRoute, "isValidRoute").mockReturnValueOnce(false);

    const app = fastify();
    await loadRoutes(app, "test/routes");

    expect(consoleWarnSpy).toHaveBeenCalled();
  });
});