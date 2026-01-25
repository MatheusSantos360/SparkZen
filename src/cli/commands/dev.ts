import { execSync } from "node:child_process";
import { Command } from "commander";
import { bgBlue, bold } from "logfy-x";
import path from "node:path";

const dev = new Command()
  .name("dev")
  .description("Run the project in development mode")
  .action(() => {
    const projectPath = process.cwd();

    const tsxPath = path.join(projectPath, "node_modules", ".bin", process.platform === "win32" ? "tsx.cmd" : "tsx");

    console.log(`\n${bgBlue(bold(" 🚀 DEV  "))} Starting development server...\n`);

    execSync(`${tsxPath} watch src/index.ts`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
    });
  });

export default dev;
