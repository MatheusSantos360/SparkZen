import fastify, { type FastifyInstance } from "fastify";
import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { registerRoute } from "../../src/core/routing/registerRoute";
import * as getRouteUrl from "../../src/core/routing/getRouteURL";

describe("registerRoute", () => {
  let app: FastifyInstance;

  beforeEach(() => {
    app = fastify();
  });

  afterEach(async () => {
    await app.close();
    vi.restoreAllMocks();
  });

  test("should register a route", async () => {
    const routeSpy = vi.spyOn(app, "route");
    const getRouteUrlSpy = vi.spyOn(getRouteUrl, "getRouteUrl").mockReturnValue("/api/users");

    const routeModule = {
      default: async (_request: any, _reply: any) => {
        return { message: "Hello, World!" };
      },
    };

    registerRoute(app, routeModule, "get", "/users/get.ts");

    const response = await app.inject({
      method: "get",
      url: "/api/users",
    });

    expect(getRouteUrlSpy).toHaveBeenCalledWith("/users/get.ts");
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: "Hello, World!" });
    expect(routeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "get",
        url: "/api/users",
        handler: routeModule.default,
      })
    );
  });

  test("should register a route with schema and middlewares", async () => {
    const routeSpy = vi.spyOn(app, "route");
    const getRouteUrlSpy = vi.spyOn(getRouteUrl, "getRouteUrl").mockReturnValue("/api/products");

    const routeModule = {
      default: async (_request: any, _reply: any) => {
        return { message: "Hello, Schema!" };
      },
      middlewares: [
        (_request: any, _reply: any, done: any) => {
          done();
        },
      ],
      schema: {
        response: {
          200: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    };

    registerRoute(app, routeModule, "get", "/products/get.ts");

    const response = await app.inject({
      method: "get",
      url: "/api/products",
    });

    expect(getRouteUrlSpy).toHaveBeenCalledWith("/products/get.ts");
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: "Hello, Schema!" });
    expect(routeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "get",
        url: "/api/products",
        handler: routeModule.default,
        schema: routeModule.schema,
        preHandler: routeModule.middlewares,
      })
    );
  });

  test("should log to console when registering a route", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const routeModule = {
      default: async (_request: any, _reply: any) => {
        return { message: "Hello, Log!" };
      },
    };

    registerRoute(app, routeModule, "post", "/orders/post.ts");

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("POST"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("/api/orders"));
  });
});
