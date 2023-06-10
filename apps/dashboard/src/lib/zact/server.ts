import type z from "zod";

declare const brand: unique symbol;

type Brand<T, TBrand extends string> = T & { [brand]: TBrand };

type ActionType<InputType extends z.ZodTypeAny, ResponseType> = (
  input: z.input<InputType>,
) => Promise<ResponseType | ZactError<InputType>>;

export type ZactError<InputType extends z.ZodTypeAny = z.ZodTypeAny> = {
  formErrors: string[];
  fieldErrors: {
    [P in keyof InputType]?: string[];
  };
};

export type ZactAction<InputType extends z.ZodTypeAny, ResponseType> = Brand<
  ActionType<InputType, ResponseType>,
  "zact-action"
>;

export function zact<InputType extends z.ZodTypeAny>(validator?: InputType) {
  // This is the "factory" that is created on call of zact. You pass it a "use server" function and it will validate the input before you call it
  return function <ResponseType>(
    action: ActionType<InputType, ResponseType>,
  ): ZactAction<InputType, ResponseType> {
    // The wrapper that actually validates
    const validatedAction = async (input: z.input<InputType>) => {
      if (validator) {
        // This will throw if the input is invalid
        const result = await validator.safeParseAsync(input);

        if (!result.success) {
          return result.error.flatten();
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return await action(result.data);
      }
      return await action(input);
    };

    return validatedAction as ZactAction<InputType, ResponseType>;
  };
}
