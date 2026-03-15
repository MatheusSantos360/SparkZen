import { Command } from "commander";
import { bgGreenBright, bold } from "logfy-x";
import { execSync } from "node:child_process";

const build = new Command()
  .name("build")
  .description("Build the project")
  .action(() => {
    process.env.NODE_ENV = "production";
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
