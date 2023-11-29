"use client";

import type { ReactNode } from "react";

import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/components/button";
import { Link } from "@acme/ui/components/link";

import { env } from "~/env.mjs";

interface Props {
  children: ReactNode;
  className?: string;
  variant?: "outline" | "link";
}

export function AppLink({
  children,
  className,
  variant: buttonVariant = "outline",
}: Props) {
  return (
    <Link
      href={`https://app.${env.NEXT_PUBLIC_APP_DOMAIN}`}
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
