import { describe, expect, test, vi, beforeEach } from "vitest";

vi.mock("logfy-x", () => ({
  dim: vi.fn((s: string) => s),
  error: vi.fn(),
}));

import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { errorHandler } from "../../src/core/functions/errorHandler";

const makeMocks = () => {
  const send = vi.fn();
  const status = vi.fn(() => ({ send }));
  const reply = { status } as unknown as FastifyReply;
  const request = {} as FastifyRequest;
  return { reply, request, send, status };
};

describe("errorHandler()", () => {
  beforeEach(() => vi.clearAllMocks());

  test("should reply with status 500", () => {
    const { reply, request, status } = makeMocks();
    const err = { name: "Error", message: "oops", stack: "Error\n    at (file.ts:1:1)" } as FastifyError;
    errorHandler(err, request, reply);
    expect(status).toHaveBeenCalledWith(500);
  });

  test("should send the correct error body", () => {
    const { reply, request, send } = makeMocks();
    const err = { name: "Error", message: "oops", stack: "Error\n    at (file.ts:1:1)" } as FastifyError;
    errorHandler(err, request, reply);
    expect(send).toHaveBeenCalledWith({
      error: "Internal Server Error",
      message: "There was an error. Please, try again.",
    });
  });

  test("should call error() logger with err info", async () => {
    const { reply, request } = makeMocks();
    const { error } = await import("logfy-x");
    const err = { name: "MyError", message: "bad", stack: "MyError\n    at (src/x.ts:5:3)" } as FastifyError;
    errorHandler(err, request, reply);
    expect(error).toHaveBeenCalledOnce();
  });
});
