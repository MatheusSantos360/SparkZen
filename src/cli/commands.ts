import type { Command } from "commander";
import init from "./commands/init";
import dev from "./commands/dev";
import build from "./commands/build";

export function registerCommands(program: Command) {
  program.addCommand(init);
  program.addCommand(dev);
  program.addCommand(build);
}
