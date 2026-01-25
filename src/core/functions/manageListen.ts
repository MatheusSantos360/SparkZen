import type { FastifyInstance, FastifyListenOptions } from "fastify";
import { bgGreenBright, blue, bold, error } from "logfy-x";
import { sparkzenBanner } from "./sparkzenBanner";

export const manageListen = (app: FastifyInstance) => {
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
};
