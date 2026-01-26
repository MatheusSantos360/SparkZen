import { FastifyError, type FastifyInstance, type preHandlerHookHandler, type RouteHandlerMethod, type RouteOptions } from "fastify";
import * as colors from "logfy-x";
import { bgBlueBright, dim, error } from "logfy-x";
import type { RouteFile } from "../../types/route";
import { getRouteUrl } from "./getRouteURL";

export const registerRoute = async (app: FastifyInstance, routeModule: RouteFile<true>, method: string, finalPath: string) => {
  const routeURL = await getRouteUrl(finalPath);
  const methodColors: { [key: string]: "green" | "yellow" | "blue" | "red" | "magentaBright" } = {
    get: "green",
    post: "yellow",
    put: "blue",
    delete: "red",
    patch: "magentaBright",
    head: "green",
    options: "magentaBright",
  };

  const routeOptions: RouteOptions = {
    ...routeModule,
    method,
    url: routeURL,
    handler: routeModule.default as RouteHandlerMethod,
    preHandler: routeModule.middlewares as preHandlerHookHandler,
  };

  try {
    app.route(routeOptions);
  } catch (err) {
    const routeError = err as FastifyError;
    console.log();
    error(`${routeError.name} ${dim(finalPath)}`, [
      `Route Path: ${finalPath}`,
      `API Path: ${colors.blue(routeURL)}`,
      `Message: ${routeError.message}`,
      `Code: ${routeError.code}`,
      `Stack: ${routeError.stack}`,
    ]);
  }

  console.log(bgBlueBright(colors.bold(` ROUTE `)) + ` ${colors[methodColors[method]](method.toUpperCase())} ${routeURL} ${colors.dim(finalPath)}`);
};
