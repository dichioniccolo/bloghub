import type z from "zod";

type ActionType<TInput extends z.ZodTypeAny, TResponse> = (
  input: z.input<TInput>,
) => Promise<TResponse>;

type MaybePromise<T> = T | Promise<T>;

type AuthenticatedActionType<TAuth, TInput extends z.ZodTypeAny, TResponse> = (
  input: z.input<TInput>,
  auth: TAuth,
) => Promise<TResponse>;

interface ResponseType<TInput extends z.ZodTypeAny, TResponse> {
  data?: TResponse;
  validationErrors?: ZactValidationError<TInput>;
  serverError?: true;
  authError?: true;
}

export interface ZactValidationError<
  TInput extends z.ZodTypeAny = z.ZodTypeAny,
> {
  formErrors: string[];
  fieldErrors: {
    [P in keyof TInput]?: string[];
  };
}

export type ZactAction<TInput extends z.ZodTypeAny, TResponse> = ActionType<
  TInput,
  ResponseType<TInput, TResponse>
>;

export function zact<TInput extends z.ZodTypeAny>(validator?: TInput) {
  // This is the "factory" that is created on call of zact. You pass it a "use server" function and it will validate the input before you call it
  return function <TResponse>(
    action: ActionType<TInput, TResponse>,
  ): ZactAction<TInput, TResponse> {
    // The wrapper that actually validates
    const validatedAction: ZactAction<TInput, TResponse> = async (
      input: z.input<TInput>,
    ) => {
      try {
        if (validator) {
          // This will throw if the input is invalid
          const result = await validator.safeParseAsync(input);

          if (!result.success) {
            return {
              validationErrors: result.error.flatten(),
            };
          }

          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            data: await action(result.data),
          };
        }
        return {
          data: await action(input),
        };
      } catch (e) {
        console.error(e);
        return {
          serverError: true,
        };
      }
    };

    return validatedAction;
  };
}

export function zactAuthenticated<TAuth>(auth: () => MaybePromise<TAuth>) {
  return <TInput extends z.ZodTypeAny>(validator?: (auth: TAuth) => TInput) => {
    return function <TResponse>(
      action: AuthenticatedActionType<TAuth, TInput, TResponse>,
    ): ZactAction<TInput, TResponse> {
      const validatedAction: ZactAction<TInput, TResponse> = async (
        input: z.input<TInput>,
      ) => {
        let authResult: TAuth;

        try {
          authResult = await auth();

          if (!authResult) {
            return {
              authError: true,
            };
          }
        } catch {
          return {
            authError: true,
          };
        }

        try {
          if (validator) {
            const result = await validator(authResult).safeParseAsync(input);

            if (!result.success) {
              return {
                validationErrors: result.error.flatten(),
              };
            }

            return {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              data: await action(result.data, authResult),
            };
          }

          return {
            data: await action(input, authResult),
          };
        } catch (e) {
          console.error(e);
          return {
            serverError: true,
          };
        }
      };

      return validatedAction;
    };
  };
}
