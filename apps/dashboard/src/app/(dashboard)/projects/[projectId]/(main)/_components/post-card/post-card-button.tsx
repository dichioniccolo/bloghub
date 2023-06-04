import { forwardRef, type PropsWithoutRef } from "react";

import { Button, type ButtonProps } from "@acme/ui";

import { cn } from "~/lib/utils";

type PostCardButtonProps = PropsWithoutRef<ButtonProps>;

export const PostCardButton = forwardRef<
  HTMLButtonElement,
  PostCardButtonProps
>(({ className, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      type="button"
      variant="secondary"
      size="sm"
      className={cn(
        "rounded-full p-1.5 transition-all duration-75 hover:scale-105 active:scale-95",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

PostCardButton.displayName = "PostCardButton";
