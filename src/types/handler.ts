import type { Static, TSchema } from "@sinclair/typebox";
import type { FastifyReply, FastifyRequest } from "fastify";

export type RouteSchema = {
  params?: TSchema;
  body?: TSchema;
  querystring?: TSchema;
  headers?: TSchema;
  response?: Record<number, TSchema>;
};

type ResponsePayload<Schema extends RouteSchema, Status extends number> =
  Schema["response"] extends Record<number, TSchema>
    ? Status extends keyof Schema["response"]
      ? Static<Schema["response"][Status]>
      : unknown
    : unknown;

type ResponseKeys<Schema extends RouteSchema> = Schema["response"] extends Record<number, TSchema> ? keyof Schema["response"] & number : number;

export type TypedReply<Schema extends RouteSchema> = Omit<FastifyReply, "send" | "status"> & {
  status: <Status extends ResponseKeys<Schema>>(
    statusCode: Status,
  ) => {
    send: (payload: ResponsePayload<Schema, Status>) => FastifyReply;
  };
};

export type Handler<Schema extends RouteSchema = {}> = (
  request: FastifyRequest<{
    Params: Schema["params"] extends TSchema ? Static<Schema["params"]> : {};
    Body: Schema["body"] extends TSchema ? Static<Schema["body"]> : {};
    Querystring: Schema["querystring"] extends TSchema ? Static<Schema["querystring"]> : {};
    Headers: Schema["headers"] extends TSchema ? Static<Schema["headers"]> : {};
  }>,
  reply: TypedReply<Schema>,
) => void | Promise<void>;
