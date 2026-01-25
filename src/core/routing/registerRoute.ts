import type { FastifyInstance, preHandlerHookHandler, RouteHandlerMethod, RouteOptions } from "fastify";
import * as colors from "logfy-x";
import { bgBlueBright } from "logfy-x";
import type { RouteFile } from "../../types/route";
import { getRouteUrl } from "./getRouteURL";

export const registerRoute = (app: FastifyInstance, routeModule: RouteFile<true>, method: string, finalPath: string) => {
  const routeURL = getRouteUrl(finalPath);
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

  app.route(routeOptions);

  console.log(bgBlueBright(colors.bold(` ROUTE `)) + ` ${colors[methodColors[method]](method.toUpperCase())} ${routeURL} ${colors.dim(finalPath)}`);
};
