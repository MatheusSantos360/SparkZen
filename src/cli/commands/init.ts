import { execSync } from "child_process";
import { Command } from "commander";
import degit from "degit";
import enquirer from "enquirer";
import fs from "fs-extra";
import { bgBlue, blue, bold, error, logfy, success } from "logfy-x";
import path from "path";

const { prompt } = enquirer;

const promptOptions = async () => {
  const terminalWidth = process.stdout.columns || 80;

  const line1 = "  🚀  Welcome to SparkZen! 🚀  ";
  const line2 = "  Let's set up your new project.   ";

  const padFor = (text: string) => {
    const available = Math.max(0, terminalWidth - text.length);
    const half = Math.floor(available / 2);
    const left = " ".repeat(half);
    const right = " ".repeat(available - half);
    return bgBlue(left) + text + bgBlue(right);
  };

  logfy(`\n${padFor(line1)}\n${padFor(line2)}\n`, { style: "bold blue -underline" });

  const answers = await prompt<{
    projectName: string;
    packageManager: "npm" | "pnpm" | "yarn" | "bun";
    installNow: boolean;
  }>([
    {
      type: "input",
      name: "projectName",
      message: "Project name:",
      required: true,
      validate: (v: string) => (v && v.trim() ? true : "Please enter a project name"),
    },
    {
      type: "select",
      name: "packageManager",
      message: "Package manager:",
      choices: ["npm", "pnpm", "yarn", "bun"],
      initial: 0,
    },
    {
      type: "confirm",
      name: "installNow",
      message: "Do you want to install dependencies now?",
      initial: true,
    },
  ]);

  return answers;
};

const cloneProjectTemplate = async (projectName: string, targetPath: string) => {
  console.log(`\n${bgBlue(bold(" 📁 CREATING "))} ${projectName}`);
  await fs.mkdirp(path.dirname(targetPath));

  console.log(`\n${bgBlue(bold(" 🔁 COPYING "))} Default template`);

  const template = degit("MatheusSantos360/sparkzen-templates/default", {
    cache: false,
    force: true,
  });

  try {
    await template.clone(targetPath);
  } catch (err) {
    throw new Error(`Failed to clone template: ${(err as Error).message}`);
  }

  const pkgJsonPath = path.join(targetPath, "package.json");
  if (!(await fs.pathExists(pkgJsonPath))) {
    error("NOT FOUND", "package.json not found in the template.");
    return;
  }

  try {
    const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
    pkgJson.name = projectName;
    await fs.writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
  } catch (err) {
    error("ERROR", `Failed to update package.json: ${(err as Error).message}`);
  }
};

const installDependencies = (packageManager: string, targetPath: string) => {
  console.log(`\n${bgBlue(bold(" ⚡ DEPENDENCIES "))} Installing with ${blue(packageManager)}:\n`);
  try {
    execSync(`${packageManager} install`, {
      cwd: targetPath,
      stdio: "inherit",
      shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
    });
  } catch (err) {
    throw new Error(`Dependency install failed: ${(err as Error).message}`);
  }
};

const init = new Command()
  .name("init")
  .description("Initialize a new SparkZen project")
  .action(async () => {
    try {
      const { projectName, packageManager, installNow } = await promptOptions();
      const targetPath = path.resolve(process.cwd(), projectName);

      await cloneProjectTemplate(projectName, targetPath);

      if (installNow) {
        installDependencies(packageManager, targetPath);
      }

      console.log()
      success("CREATED!", `Project "${blue(projectName)}" has been created successfully.`);
      console.log(`\n${bgBlue(bold(" 🔥 NEXT STEPS "))} To get started:\n`);
      console.log(`    cd ${blue(projectName)}`);
      console.log(`    ${blue(packageManager)} run ${blue("dev")}\n`);
    } catch (err) {
      error("ERROR", (err as Error).message);
      process.exit(1);
    }
  });

export default init;
