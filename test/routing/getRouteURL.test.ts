import path from "path";
import { describe, expect, test, beforeEach } from "vitest";
import { getRouteUrl } from "../../src/core/routing/getRouteURL";

describe("getRouteURL", () => {
  const cwd = process.cwd();

  beforeEach(() => {
    delete process.env.NODE_ENV;
  });

  test("should convert a simple GET route file into a URL", () => {
    const filePath = path.join(cwd, "src", "routes", "users", "get.ts");
    expect(getRouteUrl(filePath)).toBe("/api/users");
  });

  test("should handle dynamic route parameters", () => {
    const filePath = path.join(cwd, "src", "routes", "users", "[id]", "get.ts");
    expect(getRouteUrl(filePath)).toBe("/api/users/:id");
  });

  test("should support nested routes", () => {
    const filePath = path.join(cwd, "src", "routes", "users", "[id]", "posts", "get.ts");
    expect(getRouteUrl(filePath)).toBe("/api/users/:id/posts");
  });

  test("should remove src/routes only in development", () => {
    process.env.NODE_ENV = "development";
    const filePath = path.join(cwd, "src", "routes", "products", "get.ts");
    expect(getRouteUrl(filePath)).toBe("/api/products");
  });

  test("should remove only cwd in production", () => {
    process.env.NODE_ENV = "production";
    const filePath = path.join(cwd, "products", "get.ts");
    expect(getRouteUrl(filePath)).toBe("/api/products");
  });

  test("should normalize multiple slashes and backslashes", () => {
    const filePath = path.join(cwd, "src", "routes", "//users//posts//", "get.ts");
    expect(getRouteUrl(filePath)).toBe("/api/users/posts");
  });

  test("should remove the method from the url", () => {
    const filePath = path.join(cwd, "src", "routes", "auth", "login", "post.ts");
    expect(getRouteUrl(filePath)).toBe("/api/auth/login");
  });
});
