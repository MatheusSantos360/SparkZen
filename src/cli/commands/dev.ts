import { execSync } from "child_process";
import { Command } from "commander";
import path from "path";

const dev = new Command()
  .name("dev")
  .description("Run the project in development mode")
  .action(() => {
    const projectPath = process.cwd();
    const tsxPath = path.join(projectPath, "node_modules", ".bin", "tsx");
    console.log("🚀 Starting dev server...");

    execSync(`${tsxPath} watch src/index.ts`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
    });
  });

export default dev;
