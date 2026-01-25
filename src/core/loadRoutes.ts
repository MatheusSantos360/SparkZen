import type { FastifyInstance } from "fastify";
import fs from "node:fs/promises";
import path from "node:path";
import { processFile } from "./routing/processFile";

export const loadRoutes = async (app: FastifyInstance, directory?: string) => {
  const production = process.env.NODE_ENV === "production";
  const currentDir = process.cwd();
  const routesPath = directory || (production ? path.join(currentDir, "dist", "routes") : path.join(currentDir, "src", "routes"));
  const items = await fs.readdir(routesPath, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(routesPath, item.name);

    if (item.isDirectory()) {
      await loadRoutes(app, itemPath);
    } else if (item.isFile() && item.name.endsWith(production ? ".js" : ".ts")) {
      await processFile(app, item, itemPath);
    }
  }
};
