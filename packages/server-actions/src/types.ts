import type { z } from "zod";

export const enum SubmissionStatus {
  IDLE = "idle",
  PENDING = "pending",
  SUCCESS = "success",
  VALIDATION_ERROR = "validation-error",
  ERROR = "error",
}

export type MiddlewareFn = () => Promise<unknown>;

export type MiddlewareResults<M> = M extends MiddlewareFn[]
  ? {
      [K in keyof M]: M[K] extends () => Promise<infer T> ? T : never;
    }
  : undefined;
export class ErrorForClient extends Error {}
export interface EnrichedState<State, Schema extends z.ZodTypeAny> {
  state: State;
  serverError: string | null;
  validationErrors: Partial<Record<keyof z.input<Schema>, string[]>>;
  status: SubmissionStatus;
}

export type TypedServerAction<
  State,
  Schema extends z.ZodTypeAny,
  // Middlewares,
> = (params: {
  state: State;
  input: z.input<Schema>;
  // ctx?: MiddlewareResults<Middlewares>;
}) => Promise<State>;

export interface ZodActionFactoryParams<
  State,
  Schema extends z.ZodTypeAny,
  // MiddlewareFns,
> {
  schema: Schema;
  initialState: State;
  action: TypedServerAction<
    State,
    Schema
    //  MiddlewareFns
  >;
  // middlewares?: MiddlewareFns;
}

export type ServerAction<State, Schema extends z.ZodTypeAny> = (
  state: EnrichedState<State, Schema>,
  input: unknown,
) => Promise<EnrichedState<State, Schema>>;
