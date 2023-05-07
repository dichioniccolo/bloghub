import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  useForm,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { type z } from "zod";

type FormProps<S extends z.ZodType> = Omit<
  ComponentProps<"form">,
  "onSubmit" | "children"
> & {
  schema: S;
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
  initialValues,
  children,
  ...props
}: FormProps<S>) {
  const form = useZodForm(schema, {
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  return (
    <FormAsProp form={form} {...props}>
      {children}
    </FormAsProp>
  );
}

type FormAsPropProps<S extends z.ZodType> = Omit<
  ComponentPropsWithoutRef<"form">,
  "onSubmit" | "children"
> & {
  form: UseFormReturn<z.infer<S>>;
  children?: ReactNode | ((form: UseFormReturn<z.infer<S>>) => ReactNode);
};

export function FormAsProp<S extends z.ZodType>({
  form,
  children,
  ...props
}: FormAsPropProps<S>) {
  const resolvedChildren =
    typeof children === "function" ? children(form) : children;

  return (
    <FormProvider {...form}>
      <form {...props}>{resolvedChildren}</form>
    </FormProvider>
  );
}
