import fastify from "fastify";
import { loadRoutes } from "./loadRoutes";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

export async function sparkzen() {
  const app = fastify().withTypeProvider<TypeBoxTypeProvider>();
  await loadRoutes(app);

  return app;
}
