#!/usr/bin/env node
import { Command } from "commander";
import { registerCommands } from "./commands";

const program = new Command();

program.name("sparkzen").description("SparkZen CLI").version("1.0.0");

registerCommands(program);

program.parse();
