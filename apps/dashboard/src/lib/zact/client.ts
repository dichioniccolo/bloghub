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

export function useZact<InputType extends z.ZodTypeAny, ResponseType>(
  action: ZactAction<InputType, ResponseType>,
) {
  const doAction = useRef(action);

  const [data, setData] = useState<ResponseType | null>(null);

  const [isRunning, setIsLoading] = useState(false);
  const [err, setErr] = useState<Error | null>(null);

  const mutate = useMemo(
    () => async (input: z.infer<InputType>) => {
      setIsLoading(true);
      setErr(null);
      try {
        const result = await doAction.current(input);

        if (rethrowZactError(result)) {
          return null;
        }

        setData(result);
        setIsLoading(false);

        return result;
      } catch (e) {
        if (rethrowZactError(e)) {
          return null;
        }

        setErr(e as Error);
        setIsLoading(false);
        return null;
      }
    },
    [],
  );

  return {
    mutate,
    data,
    isRunning,
    error: err,
  };
}
