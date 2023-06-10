"use client";

import { useMemo, useRef, useState } from "react";
import type z from "zod";

import type { ZactAction, ZactError } from "./server";

export function rethrowZactError<InputType extends z.ZodTypeAny, ResponseType>(
  result: Awaited<ReturnType<ZactAction<InputType, ResponseType>>>,
): result is ZactError<InputType> {
  if (typeof result === "object" && result && "formErrors" in result) {
    throw result;
  }

  return false;
}

type CallbackOptions<ResponseType> = {
  onSuccess?: (data: ResponseType) => void;
  onError?: () => void;
};

export function useZact<InputType extends z.ZodTypeAny, ResponseType>(
  action: ZactAction<InputType, ResponseType>,
  callback?: CallbackOptions<ResponseType>,
) {
  const doAction = useRef(action);

  const [data, setData] = useState<ResponseType | null>(null);

  const [isRunning, setIsLoading] = useState(false);
  const [err, setErr] = useState<Error | null>(null);

  const mutate = useMemo(
    () => async (input: z.input<InputType>) => {
      setIsLoading(true);
      setErr(null);
      try {
        const result = await doAction.current(input);

        if (rethrowZactError(result)) {
          return null;
        }

        setData(result);
        setIsLoading(false);

        if (callback?.onSuccess) {
          callback.onSuccess(result);
        }

        return result;
      } catch (e) {
        if (rethrowZactError(e)) {
          return null;
        }

        setErr(e as Error);
        setIsLoading(false);

        if (callback?.onError) {
          callback.onError();
        }

        return null;
      }
    },
    [callback],
  );

  return {
    mutate,
    data,
    isRunning,
    error: err,
  };
}
