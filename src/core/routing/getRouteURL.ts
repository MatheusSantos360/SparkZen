import path from "node:path";
import { getConfig } from "../functions/getConfig";

export const getRouteUrl = async (filePath: string): Promise<string> => {
  const { routePrefix } = await getConfig();
  const production = process.env.NODE_ENV === "production";
  const basePath = production ? process.cwd() : path.join(process.cwd(), "src", "routes");

  let routePath = filePath
    .replace(basePath, "")
    .replaceAll("\\", "/")
    .replace(/\.(js|ts)$/, "");

  const segments = routePath.split("/");
  segments.pop();

  routePath = segments.join("/");

  routePath = routePath.replaceAll(/\[(\w+)\]/g, ":$1");

  return `${routePrefix}${routePath}`.replaceAll(/\/+/g, "/").replaceAll("dist/routes/", "");
};
