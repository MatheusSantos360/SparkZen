import type { FastifyInstance, RouteOptions } from "fastify";
import { getRouteUrl } from "./getRouteURL";
import { bgBlueBright } from "logfy-x";
import * as colors from "logfy-x";

export const registerRoute = (app: FastifyInstance, routeModule: any, method: string, finalPath: string) => {
  const routeURL = getRouteUrl(finalPath);
  const methodColors: { [key: string]: "green" | "yellow" | "blue" | "red" | "magenta" } = {
    get: "green",
    post: "yellow",
    put: "blue",
    delete: "red",
    patch: "magenta",
  };
  
  const routeOptions: RouteOptions = {
    ...routeModule,
    method,
    url: routeURL,
    handler: routeModule.default,
    preHandler: routeModule.middlewares,
    }
    
  app.route(routeOptions);

  console.log(bgBlueBright(colors.bold(` ROUTE `)) + ` ${colors[methodColors[method]](method.toUpperCase(), )} ${routeURL} ${colors.dim(finalPath)}`);
}
