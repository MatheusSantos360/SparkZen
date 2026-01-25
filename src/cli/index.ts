#!/usr/bin/env node
import { Command } from "commander";
import { name, version } from "../../package.json";
import { registerCommands } from "./commands";

const program = new Command();

program.name(name).description("SparkZen CLI").version(version);

registerCommands(program);

program.parse();
