import type { FastifyInstance } from "fastify";
import { pathToFileURL } from "url";
import fs from "fs/promises";
import path from "path";

export const loadRoutes = async (app: FastifyInstance, directory?: string) => {
  const production = process.env.NODE_ENV === "production";
  const currentDir = process.cwd();
  const routesPath = directory || (production ? path.join(currentDir) : path.join(currentDir, "src", "routes"));
  const items = await fs.readdir(routesPath, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(routesPath, item.name);
    console.log(`ItemPath ${itemPath}`);

    if (item.isDirectory()) {
      await loadRoutes(app, itemPath);
    } else if (item.isFile() && item.name.endsWith(production ? ".js" : ".ts")) {
      const finalPath = production ? itemPath.replace(/\.ts$/, ".js") : itemPath;
      const modulePath = pathToFileURL(finalPath).href;
      const modulePathWithQuery = production ? modulePath : `${modulePath}?t=${Date.now()}`;

      const routeModule = await import(modulePathWithQuery);

      if (routeModule?.default) {
        console.log("Loaded route module:", routeModule.default);
      } else {
        console.warn(`Module ${itemPath} does not have a default export`);
      }
    }
  }
};
