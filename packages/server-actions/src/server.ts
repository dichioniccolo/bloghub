import "server-only";

import { revalidateTag, unstable_cache } from "next/cache";
import { isNotFoundError } from "next/dist/client/components/not-found";
import { isRedirectError } from "next/dist/client/components/redirect";
import type { z } from "zod";

import type {
  MiddlewareFn,
  MiddlewareResults,
  ServerAction,
  ServerQueryHandler,
  ZodActionFactoryParams,
  ZodQueryFactoryParams,
} from "./types";
import { ErrorForClient, SubmissionStatus } from "./types";
import { DEFAULT_SERVER_ERROR, isError, normalizeInput } from "./utils";

async function getContext<
  const Middlewares extends Record<string, MiddlewareFn>,
>(
  middlewares: Middlewares | undefined,
): Promise<MiddlewareResults<Middlewares> | null> {
  return middlewares
    ? ((
        await Promise.all(
          Object.entries(middlewares).map(async ([key, fn]) => ({
            [key]: await fn(),
          })),
        )
      ).reduce(
        (result, x) => ({ ...result, ...x }),
        {},
      ) as MiddlewareResults<Middlewares>)
    : null;
}

async function parseSchema<
  const Middlewares extends Record<string, MiddlewareFn>,
  Schema extends z.ZodTypeAny,
>(
  context: MiddlewareResults<Middlewares> | null,
  schema: ((ctx: MiddlewareResults<Middlewares>) => Schema) | Schema,
  input: z.input<Schema>,
) {
  let parsedInput: z.SafeParseReturnType<Schema, Schema>;

  const normalizedInput = normalizeInput(input);

  if (typeof schema === "function") {
    parsedInput = await schema(context!).safeParseAsync(normalizedInput);
  } else {
    parsedInput = await schema.safeParseAsync(normalizedInput);
  }

  return parsedInput;
}

export function createServerAction<
  Schema extends z.ZodTypeAny,
  const Middlewares extends Record<string, MiddlewareFn>,
  State = undefined,
>({
  actionName: _,
  schema,
  initialState,
  middlewares,
  action,
  cache,
}: ZodActionFactoryParams<State, Schema, Middlewares>): ServerAction<
  State,
  Schema
> {
  return async (
    { state = initialState, serverError, validationErrors },
    input,
  ) => {
    try {
      const context = await getContext(middlewares);

      const parsedInput = await parseSchema(context, schema, input);

      if (!parsedInput.success) {
        const validationErrors = parsedInput.error.flatten()
          .fieldErrors as Partial<Record<keyof Schema, string[]>>;

        return {
          state,
          serverError,
          validationErrors,
          status: SubmissionStatus.VALIDATION_ERROR,
        };
      }

      const newState = await action({
        state,
        input: parsedInput.data,
        ctx: context as Middlewares extends Record<string, MiddlewareFn>
          ? MiddlewareResults<Middlewares>
          : undefined,
      });

      cache?.revalidateTags?.forEach((tag) => revalidateTag(tag));

      return {
        state: newState ?? state,
        serverError: null,
        validationErrors: {},
        status: SubmissionStatus.SUCCESS,
      };
    } catch (e) {
      if (!isError(e)) {
        console.error(
          "Could not handle server error. Not an instance of Error: ",
          e,
        );
        return {
          serverError: DEFAULT_SERVER_ERROR,
          state,
          validationErrors,
          status: SubmissionStatus.ERROR,
        };
      }
      if (e instanceof ErrorForClient) {
        return {
          serverError: e.message,
          state,
          validationErrors,
          status: SubmissionStatus.ERROR,
        };
      }
      if (isRedirectError(e) || isNotFoundError(e)) {
        throw e;
      }
      console.error("Server action error: ", e);
      return {
        serverError: DEFAULT_SERVER_ERROR,
        state,
        validationErrors,
        status: SubmissionStatus.ERROR,
      };
    }
  };
}

export function createServerQuery<
  Schema extends z.ZodTypeAny,
  const Middlewares extends Record<string, MiddlewareFn>,
  Result,
>({
  schema,
  middlewares,
  query,
  cache,
}: ZodQueryFactoryParams<Schema, Middlewares, Result>): ServerQueryHandler<
  Schema,
  Result
> {
  const queryHandler: ServerQueryHandler<Schema, Result> = async (input) => {
    try {
      const context = await getContext(middlewares);

      const parsedInput = await parseSchema(context, schema, input);

      if (!parsedInput.success) {
        const validationErrors = parsedInput.error.flatten()
          .fieldErrors as Partial<Record<keyof Schema, string[]>>;

        return {
          data: null,
          validationErrors,
        };
      }

      const data = await query({
        input: parsedInput.data,
        ctx: context as Middlewares extends Record<string, MiddlewareFn>
          ? MiddlewareResults<Middlewares>
          : never,
      });

      return {
        data,
      };
    } catch (e) {
      if (e instanceof ErrorForClient) {
        return {
          data: null,
          serverError: e.message,
        };
      }

      console.error("Server query error: ", e);
      return {
        data: null,
        serverError: DEFAULT_SERVER_ERROR,
      };
    }
  };

  if (cache) {
    return unstable_cache(queryHandler, cache.keys, {
      revalidate: cache.revalidate,
      tags: cache.tags,
    });
  }

  return queryHandler;
}
