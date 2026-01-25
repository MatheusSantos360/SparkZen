import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { dim, error } from "logfy-x";

export const errorHandler = (err: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
  reply.status(500).send({ error: "Internal Server Error", message: "There was an error. Please, try again." });
  const failedRoutePath = err.stack?.split("(")[1].split(")")[0] || "(No path identified)";
  error(`${err.name} ${dim(failedRoutePath)}`, [`Route Path: ${failedRoutePath}`, `Message: ${err.message}`, `Stack: ${err.stack}`]);
};