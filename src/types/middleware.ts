import type { Static, TSchema } from "@sinclair/typebox";
import type { FastifyRequest } from "fastify";
import type { RouteSchema, TypedReply } from "./handler";

type EnsureSchema<S> = S extends TSchema ? S : never;

export type MiddlewareFunction<Schema extends RouteSchema = RouteSchema> = (
  request: FastifyRequest<{
    Params: Schema["params"] extends TSchema ? Static<EnsureSchema<Schema["params"]>> : {};
    Body: Schema["body"] extends TSchema ? Static<EnsureSchema<Schema["body"]>> : {};
    Querystring: Schema["querystring"] extends TSchema ? Static<EnsureSchema<Schema["querystring"]>> : {};
    Headers: Schema["headers"] extends TSchema ? Static<EnsureSchema<Schema["headers"]>> : {};
  }>,
  reply: TypedReply<Schema>,
  done: () => void
) => void | Promise<void>;

export type Middleware<Schema extends RouteSchema = RouteSchema> = MiddlewareFunction<Schema> | MiddlewareFunction<Schema>[];
