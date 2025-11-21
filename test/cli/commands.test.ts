import { Command } from "commander";
import { describe, expect, it } from "vitest";
import { registerCommands } from "../../src/cli/commands";

describe("registerCommands", () => {
  it("registers init, dev and build commands", () => {
    const program = new Command();
    registerCommands(program);

    const names = program.commands.map((c) => c.name());

    expect(names).toContain("init");
    expect(names).toContain("dev");
    expect(names).toContain("build");
  });
});
