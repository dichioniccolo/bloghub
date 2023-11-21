import "server-only";

import type { z } from "zod";

import type {
  MiddlewareFn,
  MiddlewareResults,
  ServerAction,
  ZodActionFactoryParams,
} from "./types";
import { ErrorForClient, SubmissionStatus } from "./types";
import {
  DEFAULT_SERVER_ERROR,
  isError,
  isNextNotFoundError,
  isNextRedirectError,
  normalizeInput,
} from "./utils";

export function createServerAction<
  Schema extends z.ZodTypeAny,
  const Middlewares extends MiddlewareFn[],
  State = undefined,
>({
  schema,
  initialState,
  middlewares,
  action,
}: ZodActionFactoryParams<State, Schema, Middlewares>): ServerAction<
  State,
  Schema
> {
  return async (
    { state = initialState, serverError, validationErrors },
    input,
  ) => {
    try {
      const context =
        middlewares &&
        ((await Promise.all(
          middlewares.map((x) => x()),
        )) as MiddlewareResults<Middlewares>);

      let parsedInput: z.SafeParseReturnType<Schema, Schema>;

      const normalizedInput = normalizeInput(input);

      if (typeof schema === "function") {
        parsedInput = await schema(context!).safeParseAsync(normalizedInput);
      } else {
        parsedInput = await schema.safeParseAsync(normalizedInput);
      }

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
        ctx: context as Middlewares extends MiddlewareFn[]
          ? MiddlewareResults<Middlewares>
          : undefined,
      });

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
      if (isNextRedirectError(e) || isNextNotFoundError(e)) {
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
