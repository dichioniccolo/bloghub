import type { z } from "zod";

export const DEFAULT_SERVER_ERROR =
  "Something went wrong while executing the operation";

export const isError = (e: unknown): e is Error => e instanceof Error;

export function normalizeInput(input: unknown): unknown {
  return input instanceof FormData
    ? Object.fromEntries(input.entries())
    : input;
}

export function toFormData(input: FormData | z.ZodTypeAny): FormData {
  if (input instanceof FormData) {
    return input;
  }

  const formData = new FormData();

  Object.entries(input).forEach(([key, value]) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    formData.set(key, value);
  });

  return formData;
}
