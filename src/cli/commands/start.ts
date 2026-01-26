import { Command } from "commander";
import { execSync } from "node:child_process";

const start = new Command()
  .name("start")
  .description("Run the project in production mode")
  .action(() => {
    process.env.NODE_ENV = "production";
    const projectPath = process.cwd();

    execSync(`node dist/index.js`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
    });
  });

export default start;
