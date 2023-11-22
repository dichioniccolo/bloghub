/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useCallback, useTransition } from "react";
// @ts-expect-error boh
import { useFormState } from "react-dom";
import type { z } from "zod";

import type { EnrichedState, ServerAction } from "./types";
import { SubmissionStatus } from "./types";

interface CallbackOptions<State, Schema extends z.ZodTypeAny> {
  onSuccess?: (data: EnrichedState<State, Schema>["state"]) => unknown;
  onServerError?: (
    error: EnrichedState<State, Schema>["serverError"],
  ) => unknown;
  onValidationError?: (
    errors: EnrichedState<State, Schema>["validationErrors"],
  ) => unknown;
}

export function useServerFormAction<State, Schema extends z.ZodTypeAny>(
  actionParam: ServerAction<State, Schema>,
  options?: CallbackOptions<State, Schema>,
): EnrichedState<State, Schema> & {
  action: (payload: unknown) => Promise<EnrichedState<State, Schema>>;
} {
  const [pending, startTransition] = useTransition();

  const actionWithTransition = useCallback(
    async (...params: Parameters<ServerAction<State, Schema>>) => {
      startTransition(() => {
        //
      });
      const data = await actionParam(...params);

      if (data.status === SubmissionStatus.SUCCESS) {
        options?.onSuccess?.(data.state);
      }

      if (data.status === SubmissionStatus.ERROR) {
        options?.onServerError?.(data.serverError);
      }

      if (data.status === SubmissionStatus.VALIDATION_ERROR) {
        options?.onValidationError?.(data.validationErrors);
      }

      return data;
    },
    [actionParam],
  );

  const [{ state, serverError, validationErrors, status }, action] =
    useFormState<EnrichedState<State, Schema>, Schema>(actionWithTransition, {
      state: undefined as State,
      serverError: null,
      validationErrors: {},
      status: SubmissionStatus.IDLE,
    });

  return {
    action,
    state,
    serverError,
    validationErrors,
    status: pending ? SubmissionStatus.PENDING : status,
  };
}

export function useServerAction<State, Schema extends z.ZodTypeAny>(
  actionParam: ServerAction<State, Schema>,
  options?: CallbackOptions<State, Schema>,
): EnrichedState<State, Schema> & {
  action: (payload: z.input<Schema>) => Promise<EnrichedState<State, Schema>>;
} {
  return useServerFormAction(actionParam, options);
}
