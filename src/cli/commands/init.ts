import { execSync } from "child_process";
import { Command } from "commander";
import degit from "degit";
import enquirer from "enquirer";
import fs from "fs-extra";
import path from "path";

const { prompt } = enquirer;

const init = new Command()
  .name("init")
  .description("Initialize a new SparkZen project")
  .action(async () => {
    const { projectName, packageManager, installNow } = await prompt<{
      projectName: string;
      packageManager: "npm" | "pnpm" | "yarn" | "bun";
      installNow: boolean;
    }>([
      {
        type: "input",
        name: "projectName",
        message: "Project name:",
        required: true,
      },
      {
        type: "select",
        name: "packageManager",
        message: "Package manager:",
        choices: ["npm", "pnpm", "yarn", "bun"],
      },
      {
        type: "confirm",
        name: "installNow",
        message: "Do you want to install dependencies now?",
        initial: true,
      },
    ]);

    const targetPath = path.resolve(process.cwd(), projectName);

    console.log("📁 Creating project folder...");
    await fs.mkdir(targetPath, { recursive: true });

    console.log("📦 Copying template...");
    const template = degit("MatheusSantos360/sparkzen-templates/default", {
      cache: false,
      force: true,
    });
    await template.clone(projectName);

    const pkgJsonPath = path.join(targetPath, "package.json");
    const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
    pkgJson.name = projectName;

    await fs.writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

    console.log(`\n🚀 Project "${projectName}" created successfully!`);

    if (installNow) {
      console.log(`⚡ Installing dependencies with ${packageManager}...`);
      execSync(`${packageManager} install`, {
        cwd: targetPath,
        stdio: "inherit",
        shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
      });
    }

    console.log(`✅ Project ${projectName} created successfully!`);
    console.log(`\nNext steps:\n  cd ${projectName}\n  ${packageManager} run dev`);
  });

export default init;
