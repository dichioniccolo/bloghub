import type { z } from "zod";

export const DEFAULT_SERVER_ERROR =
  "Something went wrong while executing the operation";

const REDIRECT_ERROR_CODE = "NEXT_REDIRECT";
const NOT_FOUND_ERROR_CODE = "NEXT_NOT_FOUND";

export type NotFoundError = Error & { digest: typeof NOT_FOUND_ERROR_CODE };

export const isError = (e: unknown): e is Error => e instanceof Error;
export const isNextRedirectError = (e: unknown) =>
  isError(e) && e.message === REDIRECT_ERROR_CODE;
export const isNextNotFoundError = (e: unknown) =>
  isError(e) && e.message === NOT_FOUND_ERROR_CODE;

// export const isNextRedirectError = <U extends string>(
//   error: any,
// ): error is RedirectError<U> => {
//   if (!z.object({ digest: z.string() }).safeParse(error).success) {
//     return false;
//   }

//   const [errorCode, type, destination, permanent] = (
//     error.digest as string
//   ).split(";", 4);

//   if (!errorCode || !type || !destination || !permanent) {
//     return false;
//   }

//   return (
//     errorCode === REDIRECT_ERROR_CODE &&
//     (type === "replace" || type === "push") &&
//     typeof destination === "string" &&
//     (permanent === "true" || permanent === "false")
//   );
// };

// export const isNextNotFoundError = (error: any): error is NotFoundError =>
//   z.object({ digest: z.literal(NOT_FOUND_ERROR_CODE) }).safeParse(error)
//     .success;

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
