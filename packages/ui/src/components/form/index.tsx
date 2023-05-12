/* eslint-disable @typescript-eslint/no-misused-promises */

import {
  type ComponentProps,
  type HTMLAttributes,
  type PropsWithoutRef,
  type ReactNode,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  useForm,
  type Path,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { type z } from "zod";

type ZactError<S extends z.ZodType> = {
  formErrors: string[];
  fieldErrors: {
    [key in keyof S]: string[];
  };
};

function isZactError<S extends z.ZodType>(e: unknown): e is ZactError<S> {
  return (
    typeof e === "object" &&
    e !== null &&
    "formErrors" in e &&
    "fieldErrors" in e
  );
}

type FormProps<S extends z.ZodType> = Omit<
  ComponentProps<"form">,
  "onSubmit" | "children"
> & {
  schema: S;
  onSubmit: (values: z.infer<S>) => unknown;
  initialValues?: UseFormProps<z.infer<S>>["defaultValues"];
  children?: ReactNode | ((form: UseFormReturn<z.infer<S>>) => ReactNode);
};

export function useZodForm<S extends z.ZodType>(
  schema: S,
  options?: UseFormProps<z.infer<S>>,
): UseFormReturn<z.infer<S>> {
  return useForm<z.infer<S>>({
    ...options,
    resolver: zodResolver(schema),
  });
}

export function Form<S extends z.ZodType>({
  schema,
  onSubmit,
  initialValues,
  children,
  ...props
}: FormProps<S>) {
  const form = useZodForm(schema, {
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  return (
    <FormAsProp form={form} onSubmit={onSubmit} {...props}>
      {children}
    </FormAsProp>
  );
}

type FormAsPropProps<S extends z.ZodType> = Omit<
  PropsWithoutRef<HTMLAttributes<HTMLFormElement>>,
  "onSubmit" | "children"
> & {
  form: UseFormReturn<z.infer<S>>;
  onSubmit: (data: z.infer<S>) => unknown;
  children?: ReactNode | ((form: UseFormReturn<z.infer<S>>) => ReactNode);
};

export function FormAsProp<S extends z.ZodType>({
  form,
  onSubmit,
  children,
  ...props
}: FormAsPropProps<S>) {
  const resolvedChildren =
    typeof children === "function" ? children(form) : children;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          try {
            await onSubmit(data);
          } catch (e) {
            if (isZactError<S>(e)) {
              Object.entries(e.fieldErrors).forEach(([key, value]) => {
                form.setError(key as Path<z.TypeOf<S>>, {
                  message: value?.join(", "),
                });
              });
            }
          }
        })}
        {...props}
      >
        <fieldset
          className={props.className}
          disabled={form.formState.isSubmitting}
        >
          {resolvedChildren}
        </fieldset>
      </form>
    </FormProvider>
  );
}
