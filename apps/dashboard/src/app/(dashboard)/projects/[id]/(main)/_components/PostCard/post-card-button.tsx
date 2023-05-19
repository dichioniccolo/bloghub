import { forwardRef } from "react";

import { buttonVariants } from "@acme/ui";

import { cn } from "~/lib/utils";

export const PostCardButton = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"]
>(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        buttonVariants({
          size: "sm",
        }),
        "rounded-full bg-gray-100 p-1.5 transition-all duration-75 hover:scale-105 hover:bg-blue-100 active:scale-95 dark:bg-gray-700",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

PostCardButton.displayName = "PostCardButton";
