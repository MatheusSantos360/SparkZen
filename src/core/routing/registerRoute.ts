import type { FastifyInstance, RouteOptions } from "fastify";
import { getRouteUrl } from "./getRouteURL";

export const registerRoute = (app: FastifyInstance, routeModule: any, method: string, finalPath: string) => {
  const routeURL = getRouteUrl(finalPath);
  console.log(`Registering route: [${method.toUpperCase()}] ${routeURL}`);
  
  const routeOptions: RouteOptions = {
    ...routeModule,
    method,
    url: routeURL,
    handler: routeModule.default,
    preHandler: routeModule.middlewares,
  }

  app.route(routeOptions);
}
