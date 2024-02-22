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
  actionName: string;
  initialState?: State;
  action: TypedServerAction<State, Schema, Middlewares>;
  cache?: {
    revalidateTags?: string[];
  };
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

export type TypedServerQuery<
  Schema extends z.ZodTypeAny,
  Middlewares extends Record<string, MiddlewareFn> | undefined,
  Result,
> = (params: {
  input: z.input<Schema>;
  ctx: Middlewares extends Record<string, MiddlewareFn>
    ? MiddlewareResults<Middlewares>
    : undefined;
}) => Promise<Result>;

export type ZodQueryFactoryParams<
  Schema extends z.ZodTypeAny,
  Middlewares extends Record<string, MiddlewareFn>,
  Result,
> = {
  query: TypedServerQuery<Schema, Middlewares, Result>;
  cache?: { keys: string[]; revalidate?: number | false; tags?: string[] };
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

type EnrichedQueryResult<Schema extends z.ZodTypeAny, Result> =
  | {
      data: Result;
      serverError?: never;
      validationErrors?: never;
    }
  | {
      data: null;
      serverError: string | null;
      validationErrors?: never;
    }
  | {
      data: null;
      serverError?: never;
      validationErrors: Partial<Record<keyof z.infer<Schema>, string[]>>;
    };

// export type ServerQueryHandler<Schema extends z.ZodTypeAny, Result> = (
//   input: z.input<Schema>,
// ) => Promise<EnrichedQueryResult<Schema, Result>>;
export type ServerQueryHandler<Schema extends z.ZodTypeAny, Result> = (
  args: z.input<Schema>,
) => Promise<EnrichedQueryResult<Schema, Result>>;

export type EnrichedQueryResultType<T> =
  T extends ServerQueryHandler<infer Schema, infer Result>
    ? NonNullable<Awaited<EnrichedQueryResult<Schema, Result>>["data"]>
    : never;
