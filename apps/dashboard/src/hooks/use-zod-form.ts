import { zodResolver } from "@hookform/resolvers/zod";
import type { UseFormProps, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export function useZodForm<S extends z.ZodType>(
  schema: S,
  options?: UseFormProps<z.input<S>>,
): UseFormReturn<z.input<S>> {
  return useForm<z.input<S>>({
    ...options,
    resolver: zodResolver(schema),
  });
}
