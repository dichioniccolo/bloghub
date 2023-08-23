"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";
import { env } from "~/env.mjs";
import { cn } from "~/lib/cn";

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
