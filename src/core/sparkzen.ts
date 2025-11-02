import fastify from "fastify";
import { loadRoutes } from "./loadRoutes";

export async function sparkzen() {
  const app = fastify();
  await loadRoutes(app);

  return app;
}
