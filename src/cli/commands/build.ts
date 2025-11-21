import { execSync } from "child_process";
import { Command } from "commander";
import path from "path";

const build = new Command()
  .name("build")
  .description("Build the project")
  .action(() => {
    const projectPath = process.cwd();
    console.log("🚀 Building the project...");

    const tsupPath = path.join(process.cwd(), "node_modules", ".bin", "tsup");

    execSync(`${tsupPath} src/index.ts --format esm --dts --out-dir dist`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
    });
  });

export default build;
