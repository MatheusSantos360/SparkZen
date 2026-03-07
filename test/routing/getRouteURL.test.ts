import path from "node:path";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../../src/core/functions/getConfig", () => ({
  getConfig: vi.fn().mockResolvedValue({ routePrefix: "/api/" }),
}));

import { getRouteUrl } from "../../src/core/routing/getRouteURL";

const cwd = process.cwd();

describe("getRouteURL", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "development";
  });

  test("should convert a simple GET route file into a URL", async () => {
    const filePath = path.join(cwd, "src", "routes", "users", "get.ts");
    expect(await getRouteUrl(filePath)).toBe("/api/users");
  });

  test("should handle dynamic route parameters", async () => {
    const filePath = path.join(cwd, "src", "routes", "users", "[id]", "get.ts");
    expect(await getRouteUrl(filePath)).toBe("/api/users/:id");
  });

  test("should support nested routes", async () => {
    const filePath = path.join(cwd, "src", "routes", "users", "[id]", "posts", "get.ts");
    expect(await getRouteUrl(filePath)).toBe("/api/users/:id/posts");
  });

  test("should remove src/routes only in development", async () => {
    process.env.NODE_ENV = "development";
    const filePath = path.join(cwd, "src", "routes", "products", "get.ts");
    expect(await getRouteUrl(filePath)).toBe("/api/products");
  });

  test("should remove only cwd in production", async () => {
    process.env.NODE_ENV = "production";
    const filePath = path.join(cwd, "dist", "routes", "products", "get.ts");
    expect(await getRouteUrl(filePath)).toBe("/api/products");
  });

  test("should normalize multiple slashes", async () => {
    const filePath = path.join(cwd, "src", "routes", "users", "posts", "get.ts");
    expect(await getRouteUrl(filePath)).toBe("/api/users/posts");
  });

  test("should remove the method segment from the url", async () => {
    const filePath = path.join(cwd, "src", "routes", "auth", "login", "post.ts");
    expect(await getRouteUrl(filePath)).toBe("/api/auth/login");
  });
});
