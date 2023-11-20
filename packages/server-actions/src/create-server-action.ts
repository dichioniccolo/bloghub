import "server-only";

import type { z } from "zod";

import type { ServerAction, ZodActionFactoryParams } from "./types";
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
  // const Middlewares extends
  //   | [MiddlewareFn, ...MiddlewareFn[]]
  //   | undefined = undefined,
  State = undefined,
>({
  schema,
  initialState,
  // middlewares,
  action,
}: ZodActionFactoryParams<
  State,
  Schema
  // Middlewares
>): ServerAction<State, Schema> {
  return async (
    { state = initialState, serverError, validationErrors },
    input,
  ) => {
    try {
      const parsedInput = await schema.safeParseAsync(normalizeInput(input));

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

      // const ctx =
      //   middlewares &&
      //   ((await Promise.all(
      //     middlewares.map((fn) => fn()),
      //   )) as MiddlewareResults<Middlewares>);

      const newState = await action({
        state,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        input: parsedInput.data,
        // ctx,
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
