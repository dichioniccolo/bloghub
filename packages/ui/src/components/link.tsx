import type { AnchorHTMLAttributes, ElementRef } from "react";
import { forwardRef } from "react";
import type { LinkProps } from "next/link";
import NextLink from "next/link";

export const Link = forwardRef<
  ElementRef<"a">,
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps
>(({ prefetch, ...props }, ref) => {
  return <NextLink {...props} ref={ref} prefetch={prefetch ?? false} />;
});

Link.displayName = "Link";
