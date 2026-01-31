import { execSync } from "node:child_process";
import { Command } from "commander";
import { bgGreenBright, bold } from "logfy-x";

const build = new Command()
  .name("build")
  .description("Build the project")
  .action(() => {
    const projectPath = process.cwd();
    console.log(`${bgGreenBright(bold(" 📦 BUILD "))} Building the project...\n`);

    execSync(`npx tsup`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
    });

    console.log(`\n${bgGreenBright(bold(" ✅ BUILD "))} Build completed successfully!\n`);
  });

export default build;
