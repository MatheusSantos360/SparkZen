import { describe, expect, it } from "vitest";
import init from "../../src/cli/commands/init";

describe("init command", () => {
  it("has correct name and description and an action handler", () => {
    expect(init.name()).toBe("init");
    expect(init.description()).toContain("Initialize");
    const action = (init as any)._actionHandler;
    expect(typeof action).toBe("function");
  });
});
