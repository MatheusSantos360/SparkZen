import type { Command } from "commander";
import { init } from "./commands/init";

export function registerCommands(program: Command) {
  program.command("init").description("Start dev mode").action(init);
}
