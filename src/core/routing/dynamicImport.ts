import type { RouteFile } from "../../types/route";

export const dynamicImport = async (modulePath: string): Promise<Partial<RouteFile>> => {
  return await import(modulePath);
};
