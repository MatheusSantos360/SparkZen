import { execSync } from "node:child_process";
import { Command } from "commander";
import { bgGreenBright, bold } from "logfy-x";
import path from "node:path";

const build = new Command()
  .name("build")
  .description("Build the project")
  .action(() => {
    const projectPath = process.cwd();
    console.log(`${bgGreenBright(bold(" 📦 BUILD "))} Building the project...\n`);

    const tsupPath = path.join(process.cwd(), "node_modules", ".bin", "tsup");

    execSync(`${tsupPath} src/index.ts --format esm --out-dir dist`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
    });

    console.log(`\n${bgGreenBright(bold(" ✅ BUILD "))} Build completed successfully!\n`);
  });

export default build;
