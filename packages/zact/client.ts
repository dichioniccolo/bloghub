"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import type z from "zod";

import type { ZactAction, ZactValidationError } from "./server";

type CallbackOptions<InputType extends z.ZodTypeAny, ResponseType> = {
  onBeforeAction?: (input: z.input<InputType>) => void;
  onSuccess?: (data: ResponseType) => void;
  onError?: (e: unknown) => void;
  onValidationError?: (errors: ZactValidationError<InputType>) => void;
};

export function useZact<InputType extends z.ZodTypeAny, ResponseType>(
  action: ZactAction<InputType, ResponseType>,
  callback?: CallbackOptions<InputType, ResponseType>,
) {
  const doAction = useRef(action);

  const [data, setData] = useState<ResponseType | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  const [isRunning, startTransition] = useTransition();

  const mutate = useCallback(
    (input: z.input<InputType>) => {
      return new Promise((resolve, reject) => {
        // @ts-expect-error start transition should include a Promise<void>
        startTransition(async () => {
          setError(null);

          if (callback?.onBeforeAction) {
            callback.onBeforeAction(input);
          }

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

          setData(result.data ?? null);
          resolve(result.data ?? null);
        });
      });
    },
    [callback],
  );

  return {
    mutate,
    data,
    isRunning,
    error: error,
  };
}
