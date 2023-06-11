"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import type z from "zod";

import type { ZactAction, ZactValidationError } from "./server";

type CallbackOptions<InputType extends z.ZodTypeAny, ResponseType> = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (e: unknown) => void;
  onValidationError?: (errors: ZactValidationError<InputType>) => void;
};

export function useZact<InputType extends z.ZodTypeAny, ResponseType>(
  action: ZactAction<InputType, ResponseType>,
  callback?: CallbackOptions<InputType, ResponseType>,
) {
  const doAction = useRef(action);

  const [error, setError] = useState<unknown | null>(null);

  const [isRunning, startTransition] = useTransition();

  const mutate = useCallback(
    (input: z.input<InputType>) => {
      return new Promise((resolve, reject) => {
        startTransition(async () => {
          setError(null);

          const result = await doAction.current(input);

          if (result.validationErrors) {
            if (callback?.onValidationError) {
              callback.onValidationError(result.validationErrors);
            } else {
              reject(result.validationErrors);
              return;
            }
          }

          if (result.serverError) {
            setError(result.serverError);

            if (callback?.onError) {
              callback.onError(result.serverError);
            }

            resolve(null);
          }

          if (callback?.onSuccess && result.data) {
            callback.onSuccess(result.data);
          }

          resolve(result.data ?? null);
        });
      });
    },
    [callback],
  );

  return {
    mutate,
    isRunning,
    error: error,
  };
}
