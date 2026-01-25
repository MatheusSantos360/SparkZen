import type { RouteFile } from "../../types/route";

export const isValidRoute = (routeModule: Partial<RouteFile>): boolean => {
  return routeModule && typeof routeModule === "object" && typeof routeModule.default === "function";
};
