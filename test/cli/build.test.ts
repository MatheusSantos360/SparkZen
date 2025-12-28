import * as child_process from "child_process";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import build from "../../src/cli/commands/build";

vi.mock("child_process", () => ({ execSync: vi.fn() }));

describe("build command", () => {
  let execSpy: Mock;

  beforeEach(() => {
    execSpy = child_process.execSync as unknown as Mock;
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls execSync with tsup build command", () => {
    const action = (build as any)._actionHandler;
    expect(typeof action).toBe("function");

    action([]);

    const calls = execSpy.mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const firstArg = String(calls[0][0]);
    expect(firstArg).toContain("tsc");
  });
});
