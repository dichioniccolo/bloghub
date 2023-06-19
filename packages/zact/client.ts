/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import type z from "zod";

import type { ZactAction, ZactValidationError } from "./server";

type CallbackOptions<InputType extends z.ZodTypeAny, ResponseType> = {
  onBeforeAction?: (input: z.input<InputType>) => unknown;
  onSuccess?: (data: ResponseType) => unknown;
  onServerError?: () => unknown;
  onValidationError?: (errors: ZactValidationError<InputType>) => unknown;
};

export function useZact<InputType extends z.ZodTypeAny, ResponseType>(
  action: ZactAction<InputType, ResponseType>,
  callback?: CallbackOptions<InputType, ResponseType>,
) {
  const doAction = useRef(action);

  const [data, setData] = useState<ResponseType | null>(null);

  const [isRunning, startTransition] = useTransition();

  const mutate = useCallback(
    (input: z.input<InputType>) => {
      return new Promise((resolve, reject) => {
        // @ts-ignore
        startTransition(async () => {
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
            if (callback?.onServerError) {
              callback.onServerError();
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
  };
}
