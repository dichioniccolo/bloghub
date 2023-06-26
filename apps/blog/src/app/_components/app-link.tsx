"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@bloghub/ui";
import { buttonVariants } from "@bloghub/ui/components/button";

import { env } from "~/env.mjs";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: "outline" | "link";
};

export function AppLink({
  children,
  className,
  variant: buttonVariant = "outline",
}: Props) {
  return (
    <Link
      href={env.NEXT_PUBLIC_APP_URL}
      target="_blank"
      className={cn(
        buttonVariants({
          variant: buttonVariant,
        }),
        className,
      )}
    >
      {children}
    </Link>
  );
}
