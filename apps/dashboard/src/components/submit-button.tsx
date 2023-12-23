"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import type { ButtonProps } from "@acme/ui/components/ui/button";
import { Button } from "@acme/ui/components/ui/button";

export const SubmitButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, disabled, "aria-disabled": ariaDisabled, ...props }, ref) => {
    const { pending } = useFormStatus();

    return (
      <Button
        ref={ref}
        disabled={pending || disabled}
        aria-disabled={pending || ariaDisabled}
        {...props}
      >
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    );
  },
);

SubmitButton.displayName = "SubmitButton";
