import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("logfy-x", () => ({
  bgGreenBright: vi.fn((s: string) => s),
  blue: vi.fn((s: string) => s),
  bold: vi.fn((s: string) => s),
  error: vi.fn(),
}));
vi.mock("../../src/core/functions/sparkzenBanner", () => ({
  sparkzenBanner: vi.fn(),
}));

import type { FastifyInstance } from "fastify";
import { manageListen } from "../../src/core/functions/manageListen";
import { sparkzenBanner } from "../../src/core/functions/sparkzenBanner";

const sparkzenBannerMock = vi.mocked(sparkzenBanner);

const makeApp = () => {
  const listenSpy = vi.fn().mockResolvedValue("done");
  const app = { listen: listenSpy } as unknown as FastifyInstance;
  return { app, listenSpy };
};

describe("manageListen()", () => {
  beforeEach(() => vi.clearAllMocks());

  test("should replace app.listen with a new function", () => {
    const { app, listenSpy } = makeApp();
    manageListen(app);
    expect(app.listen).not.toBe(listenSpy);
  });

  test("should call sparkzenBanner when listen is invoked", async () => {
    const { app } = makeApp();
    manageListen(app);
    await (app.listen as any)({ port: 3000 });
    expect(sparkzenBannerMock).toHaveBeenCalledOnce();
  });

  test("should call the original listen with provided options", async () => {
    const { app, listenSpy } = makeApp();
    manageListen(app);
    await (app.listen as any)({ port: 4000 });
    expect(listenSpy).toHaveBeenCalledWith({ port: 4000 });
  });

  test("should log error when originalListen throws", async () => {
    const { error } = await import("logfy-x");
    const app = {
      listen: vi.fn().mockRejectedValue(new Error("bind failed")),
    } as unknown as FastifyInstance;
    manageListen(app);
    await (app.listen as any)({ port: 3000 });
    expect(error).toHaveBeenCalledOnce();
  });
});
