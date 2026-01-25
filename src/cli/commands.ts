import type { Command } from "commander";
import build from "./commands/build";
import dev from "./commands/dev";
import init from "./commands/init";

export function registerCommands(program: Command) {
  program.addCommand(init);
  program.addCommand(dev);
  program.addCommand(build);
}
