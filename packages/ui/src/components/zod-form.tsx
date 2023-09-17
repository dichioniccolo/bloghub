"use client";

import * as React from "react";
import type { Path, UseFormProps, UseFormReturn } from "react-hook-form";
import { FormProvider, useFormContext, useWatch } from "react-hook-form";
import type { z } from "zod";

import { useDebouncedCallback } from "../hooks/use-debounced-callback";
import { useDeepCompareEffect } from "../hooks/use-deep-compare-effect";

interface ZactError<S extends z.ZodType> {
  formErrors: string[];
  fieldErrors: {
    [key in keyof S]: string[];
  };
}

function isZactError<S extends z.ZodType>(e: unknown): e is ZactError<S> {
  return (
    typeof e === "object" &&
    e !== null &&
    "formErrors" in e &&
    "fieldErrors" in e
  );
}

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
          } catch (e) {
            if (isZactError<S>(e)) {
              mapZactErrors(form, e);
            }
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

function mapZactErrors<S extends z.ZodType>(
  form: UseFormReturn<z.input<S>>,
  error: ZactError<S>,
) {
  Object.entries(error.fieldErrors).forEach(([key, value]) => {
    form.setError(key as Path<z.TypeOf<S>>, {
      message: value?.join(", "),
    });
  });
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
      } catch (e) {
        if (isZactError<S>(e)) {
          mapZactErrors(form, e);
        }
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
