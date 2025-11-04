import { isValidRoute } from "../core/routing/isValidRoute.js";
import { registerRoute } from "./routing/registerRoute.js";
import type { FastifyInstance } from "fastify";
import { pathToFileURL } from "url";
import fs from "fs/promises";
import path from "path";
import { dynamicImport } from "./routing/dynamicImport.js";

export const loadRoutes = async (app: FastifyInstance, directory?: string) => {
  const production = process.env.NODE_ENV === "production";
  const ext = production ? ".js" : ".ts";
  const currentDir = process.cwd();
  const routesPath = directory || (production ? path.join(currentDir) : path.join(currentDir, "src", "routes"));
  const items = await fs.readdir(routesPath, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(routesPath, item.name);

    if (item.isDirectory()) {
      await loadRoutes(app, itemPath);
    } else if (item.isFile() && item.name.endsWith(production ? ".js" : ".ts")) {
      const finalPath = production ? itemPath.replace(/\.ts$/, ".js") : itemPath;
      const modulePath = pathToFileURL(finalPath).href;
      const modulePathWithQuery = production ? modulePath : `${modulePath}?t=${Date.now()}`;

      const routeModule = await dynamicImport(modulePathWithQuery);

      if (isValidRoute(routeModule)) {
        const method = item.name.replace(new RegExp(`${ext}$`), "").toLowerCase();
        registerRoute(app, routeModule, method, finalPath);
      } else {
        console.warn(`Invalid route module: ${modulePath}`);
      }
    }
  }
};
