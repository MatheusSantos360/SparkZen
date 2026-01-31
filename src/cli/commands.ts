import type { Command } from "commander";
import build from "./commands/app/build";
import dev from "./commands/app/dev";
import start from "./commands/app/start";
import init from "./commands/init";
import create from "./commands/routes/create";

export function registerCommands(program: Command) {
  // App
  program.addCommand(init);
  program.addCommand(dev);
  program.addCommand(build);
  program.addCommand(start);

  // Routes
  program.addCommand(create);
}
