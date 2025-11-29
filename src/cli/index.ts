#!/usr/bin/env node
import { Command } from "commander";
import { registerCommands } from "./commands";
import { name, version } from "../../package.json"

const program = new Command();

program.name(name).description("SparkZen CLI").version(version);

registerCommands(program);

program.parse();
