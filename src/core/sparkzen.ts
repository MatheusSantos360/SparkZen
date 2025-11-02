import fastify from "fastify";
import { loadRoutes } from "./loadRoutes";

export function sparkzen() {
  const app = fastify();
  loadRoutes(app);

  return app;
}
