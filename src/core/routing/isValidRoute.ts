export const isValidRoute = (routeModule: any): boolean => {
  return routeModule &&
    typeof routeModule === "object" &&
    typeof routeModule.default === "function";
}