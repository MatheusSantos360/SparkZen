import path from "path";

export const getRouteUrl = (filePath: string): string => {
  const production = process.env.NODE_ENV === "production";
  const basePath = production ? process.cwd() : path.join(process.cwd(), "src", "routes");

  let routePath = filePath
    .replace(basePath, "")
    .replaceAll('\\', "/")
    .replace(/\.(js|ts)$/, "");

  const segments = routePath.split("/");
  segments.pop();

  routePath = segments.join("/");

  routePath = routePath.replace(/\[(\w+)\]/g, ":$1");

  return `/api${routePath}`.replace(/\/+/g, "/").replaceAll("dist/routes/", "");
}
