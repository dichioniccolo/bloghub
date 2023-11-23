"use client";

import { useCallback, useOptimistic, useTransition } from "react";
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

export function useServerAction<const State, const Schema extends z.ZodTypeAny>(
  actionParam: ServerAction<State, Schema>,
  options?: CallbackOptions<State, Schema>,
): EnrichedState<State, Schema> & {
  action: (payload: z.input<Schema>) => void;
} {
  const [pending, startTransition] = useTransition();

  const actionWithTransition = useCallback(
    (...params: Parameters<ServerAction<State, Schema>>) => {
      return new Promise<EnrichedState<State, Schema>>((resolve, reject) => {
        startTransition(() => {
          actionParam(...params)
            .then((data) => {
              if (data.status === SubmissionStatus.SUCCESS) {
                options?.onSuccess?.(data.state);
              }

              if (data.status === SubmissionStatus.ERROR) {
                options?.onServerError?.(data.serverError);
              }

              if (data.status === SubmissionStatus.VALIDATION_ERROR) {
                options?.onValidationError?.(data.validationErrors);
              }

              resolve(data);
            })
            .catch((error) => {
              reject(error);
            });
        });
      });
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

export function useOptimisticAction<
  const State,
  const OptimisticData,
  const Schema extends z.ZodTypeAny,
>(
  actionParam: ServerAction<State, Schema>,
  initialOptimisticState: OptimisticData,
  reducer: (state: OptimisticData, payload: z.input<Schema>) => OptimisticData,
  options?: CallbackOptions<State, Schema>,
): EnrichedState<State, Schema> & {
  action: (payload: z.input<Schema>) => void;
  optimisticState: OptimisticData;
} {
  const [optimisticState, setOptimisticState] = useOptimistic<
    OptimisticData,
    z.input<Schema>
  >(initialOptimisticState, reducer);

  const [pending, startTransition] = useTransition();

  const actionWithTransition = useCallback(
    (...params: Parameters<ServerAction<State, Schema>>) => {
      return new Promise<EnrichedState<State, Schema>>((resolve, reject) => {
        startTransition(() => {
          setOptimisticState(params[1]);

          actionParam(...params)
            .then((data) => {
              if (data.status === SubmissionStatus.SUCCESS) {
                options?.onSuccess?.(data.state);
              }

              if (data.status === SubmissionStatus.ERROR) {
                options?.onServerError?.(data.serverError);
              }

              if (data.status === SubmissionStatus.VALIDATION_ERROR) {
                options?.onValidationError?.(data.validationErrors);
              }

              resolve(data);
            })
            .catch((error) => {
              reject(error);
            });
        });
      });
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
    optimisticState,
    state,
    serverError,
    validationErrors,
    status: pending ? SubmissionStatus.PENDING : status,
  };
}
