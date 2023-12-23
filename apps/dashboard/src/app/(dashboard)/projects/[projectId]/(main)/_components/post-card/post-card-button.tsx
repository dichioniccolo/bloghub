import type { ElementRef, PropsWithoutRef } from "react";
import { forwardRef } from "react";

import { cn } from "@acme/ui";
import type { ButtonProps } from "@acme/ui/components/ui/button";
import { Button } from "@acme/ui/components/ui/button";

type PostCardButtonProps = PropsWithoutRef<ButtonProps>;

export const PostCardButton = forwardRef<
  ElementRef<"button">,
  PostCardButtonProps
>(({ className, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      type="button"
      variant="secondary"
      size="xxs"
      className={cn(
        "group rounded-full p-1.5 transition-all duration-75 hover:scale-105 active:scale-95",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

PostCardButton.displayName = "PostCardButton";
