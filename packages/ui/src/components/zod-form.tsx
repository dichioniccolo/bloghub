"use client";

import * as React from "react";
import type { UseFormProps, UseFormReturn } from "react-hook-form";
import { FormProvider, useFormContext, useWatch } from "react-hook-form";
import type { z } from "zod";

import { useDebouncedCallback } from "../hooks/use-debounced-callback";
import { useDeepCompareEffect } from "../hooks/use-deep-compare-effect";

type FormProps<TSchema extends z.ZodType> = Omit<
  React.PropsWithoutRef<React.HTMLAttributes<HTMLFormElement>>,
  "onSubmit"
> & {
  form: UseFormReturn<z.input<TSchema>>;
  onSubmit(values: z.input<TSchema>): unknown;
  disableOnSubmitting?: boolean;
};

export function Form<S extends z.ZodType>({
  form,
  onSubmit,
  children,
  disableOnSubmitting = true,
  ...props
}: FormProps<S>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          try {
            await onSubmit(data);
          } catch {
            //
          }
        })}
        {...props}
      >
        <fieldset
          className={props.className}
          disabled={disableOnSubmitting && form.formState.isSubmitting}
        >
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
}

interface AutoSaveProps<S extends z.ZodType> {
  onSubmit(values: z.input<S>): unknown;
  initialValues?: UseFormProps<z.input<S>>["defaultValues"];
  delay?: number;
}

export const useAutoSaveForm = <S extends z.ZodType>({
  onSubmit,
  initialValues,
  delay = 1000,
}: AutoSaveProps<S>) => {
  const form = useFormContext();

  const debouncedSave = useDebouncedCallback(() => {
    void form.handleSubmit(async (data) => {
      try {
        await onSubmit(data);
      } catch {
        //
      }
    })();
  }, delay);

  // // Watch all the data, provide with defaultValues from server, this way we know if the new data came from server or where actually edited by user
  // const watchedData = methods.watch(undefined, defaultValues);
  const watchedData = useWatch({
    control: form.control,
    defaultValue: initialValues,
  });

  useDeepCompareEffect(() => {
    if (form.formState.isDirty) {
      debouncedSave();
    }
  }, [watchedData]);

  return {
    isAutosaving: form.formState.isSubmitting,
  };
};

export function AutoSave<S extends z.ZodType>({
  ...options
}: AutoSaveProps<S>) {
  useAutoSaveForm(options);

  return null;
}
