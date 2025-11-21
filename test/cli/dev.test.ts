import * as child_process from "child_process";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import dev from "../../src/cli/commands/dev";

vi.mock("child_process", () => ({ execSync: vi.fn() }));

describe("dev command", () => {
  let execSpy: Mock;

  beforeEach(() => {
    execSpy = child_process.execSync as unknown as Mock;
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls execSync with tsx watch", () => {
    const action = (dev as any)._actionHandler;
    expect(typeof action).toBe("function");

    action([]);

    expect(execSpy.mock.calls.length).toBeGreaterThan(0);
    const callArg = execSpy.mock.calls[0][0];
    expect(String(callArg)).toContain("watch src/index.ts");
  });
});
