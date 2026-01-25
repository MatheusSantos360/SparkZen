import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import { bgBlueBright, bgGreenBright } from "logfy-x";
import { errorHandler } from "./functions/errorHandler";
import { sparkzenBanner } from "./functions/sparkzenBanner";
import { loadRoutes } from "./loadRoutes";
import { manageListen } from "./functions/manageListen";

export async function sparkzen() {
  sparkzenBanner("INITIALIZING API", bgBlueBright);

  const app = fastify().withTypeProvider<TypeBoxTypeProvider>();

  sparkzenBanner("LOADING ROUTES", bgGreenBright);
  await loadRoutes(app);
  console.log();

  manageListen(app)
  app.setErrorHandler(errorHandler);

  return app;
}
