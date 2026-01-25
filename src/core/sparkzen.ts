import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify, { type FastifyListenOptions } from "fastify";
import { bgBlueBright, bgGreenBright, blue, bold, dim, error } from "logfy-x";
import { loadRoutes } from "./loadRoutes";

function sparkzenBanner(message: string, color: (str: string) => string) {
  const tag = color(bold(" SPARKZEN "));
  const line = dim("─".repeat(10 * 2 + message.length + 2));
  console.log(`\n${tag} ${bold(message)} ${tag}\n${line}`);
}

export async function sparkzen() {
  sparkzenBanner("INITIALIZING API", bgBlueBright);

  const app = fastify().withTypeProvider<TypeBoxTypeProvider>();

  sparkzenBanner("LOADING ROUTES", bgGreenBright);
  await loadRoutes(app);
  console.log();

  const originalListen = app.listen.bind(app);

  app.listen = async function (options?: FastifyListenOptions) {
    try {
      sparkzenBanner("STARTING SERVER", bgGreenBright);

      const result = await originalListen(options);
      const runningAt = `http://localhost:${options?.port}`;

      console.log(`${bgGreenBright(bold(" SERVER "))} Running at: ${blue(runningAt)}\n`);

      return result;
    } catch (err) {
      error("ERROR", (err as Error).name + `: ${(err as Error).message}\n\n${(err as Error).stack}`);
    }
  } as any;

  return app;
}
