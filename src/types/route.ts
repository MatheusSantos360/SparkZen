import type { TObject, TProperties } from "@sinclair/typebox";
import type { Handler } from "./handler";
import type { Middleware } from "./middleware";

export type RouteFile<V extends boolean = false> = {
  default: V extends true ? Handler : Handler | undefined;
  middlewares?: Middleware | Middleware[];
  schema?: Partial<{
    params: TObject<TProperties>;
    body: TObject<TProperties>;
    response: Record<number, TObject<TProperties>>;
  }>;
};
