import { sparkzen } from "./core/sparkzen";

// Main sparkzen function
export default sparkzen;

// Export types
export type { Handler } from "./types/handler";
export type { Middleware, MiddlewareFunction } from "./types/middleware";
export type { Config } from "./types/config";

// Export TypeBox utilities
export { Type as T, type Static } from "@sinclair/typebox";
