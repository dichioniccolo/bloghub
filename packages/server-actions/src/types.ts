import type { z } from "zod";

export const enum SubmissionStatus {
  IDLE = "idle",
  PENDING = "pending",
  SUCCESS = "success",
  VALIDATION_ERROR = "validation-error",
  ERROR = "error",
}

export type MiddlewareFn = () => Promise<unknown>;

export type MiddlewareResults<Middleware extends Record<string, MiddlewareFn>> =
  {
    [K in keyof Middleware]: Middleware[K] extends () => Promise<infer T>
      ? T
      : never;
  };

export class ErrorForClient extends Error {}

export interface EnrichedState<State, Schema extends z.ZodTypeAny> {
  state?: State;
  serverError: string | null;
  validationErrors: Partial<Record<keyof z.infer<Schema>, string[]>>;
  status: SubmissionStatus;
}

export type TypedServerAction<
  State,
  Schema extends z.ZodTypeAny,
  Middlewares extends Record<string, MiddlewareFn> | undefined,
> = (params: {
  state?: State;
  input: z.input<Schema>;
  ctx: Middlewares extends Record<string, MiddlewareFn>
    ? MiddlewareResults<Middlewares>
    : undefined;
}) => Promise<State | void>;

export type TypedServerActionWithoutInput<
  State,
  Middlewares extends Record<string, MiddlewareFn> | undefined,
> = (params: {
  state?: State;
  ctx: Middlewares extends Record<string, MiddlewareFn>
    ? MiddlewareResults<Middlewares>
    : undefined;
}) => Promise<State | void>;

export type ZodActionFactoryParams<
  State,
  Schema extends z.ZodTypeAny,
  Middlewares extends Record<string, MiddlewareFn>,
> = {
  initialState?: State;
  action: TypedServerAction<State, Schema, Middlewares>;
} & (
  | {
      schema: Schema | ((ctx: MiddlewareResults<Middlewares>) => Schema);
      middlewares: Middlewares;
    }
  | {
      schema: Schema;
      middlewares?: never;
    }
);

export type ServerAction<State, Schema extends z.ZodTypeAny> = (
  state: EnrichedState<State, Schema>,
  input: z.input<Schema>,
) => Promise<EnrichedState<State, Schema>>;
