"use client";

import { Toaster as BaseToaster } from "sonner";

export function Toaster() {
  return <BaseToaster closeButton />;
}

export { toast } from "sonner";
