import type { FastifyInstance } from "fastify";
import { bgRedBright, bold, dim, red } from "logfy-x";
import type { Dirent } from "node:fs";
import { pathToFileURL } from "node:url";
import type { RouteFile } from "../../types/route";
import { dynamicImport } from "./dynamicImport";
import { isValidRoute } from "./isValidRoute";
import { registerRoute } from "./registerRoute";

export const processFile = async (app: FastifyInstance, item: Dirent<string>, filePath: string) => {
  const production = process.env.NODE_ENV === "production";
  const ext = production ? ".js" : ".ts";

  const finalPath = production ? filePath.replace(/\.ts$/, ".js") : filePath;
  const modulePath = pathToFileURL(finalPath).href;
  const modulePathWithQuery = production ? modulePath : `${modulePath}?t=${Date.now()}`;

  const routeModule = await dynamicImport(modulePathWithQuery);

  if (isValidRoute(routeModule)) {
    const method = item.name.replace(new RegExp(`${ext}$`), "").toLowerCase();
    registerRoute(app, routeModule as RouteFile<true>, method, finalPath);
  } else {
    console.log(bgRedBright(bold(` ROUTE `)) + ` ${red("Invalid Route (No handler exported)")} ${dim(finalPath)}`);
  }
};
