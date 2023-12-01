import "server-only";

import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import * as Sentry from "@sentry/nextjs";
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
  const Middlewares extends Record<string, MiddlewareFn>,
  State = undefined,
>({
  actionName,
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
    return await Sentry.withServerActionInstrumentation(
      actionName,
      {
        formData: input,
        headers: headers(),
        recordResponse: true,
      },
      async () => {
        try {
          const context =
            middlewares &&
            ((
              await Promise.all(
                Object.entries(middlewares).map(async ([key, fn]) => ({
                  [key]: await fn(),
                })),
              )
            ).reduce(
              (result, x) => ({ ...result, ...x }),
              {},
            ) as MiddlewareResults<Middlewares>);

          let parsedInput: z.SafeParseReturnType<Schema, Schema>;

          const normalizedInput = normalizeInput(input);

          if (typeof schema === "function") {
            parsedInput = await schema(context!).safeParseAsync(
              normalizedInput,
            );
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
      },
    );
  };
}
