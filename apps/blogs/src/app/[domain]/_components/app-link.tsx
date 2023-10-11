"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { subdomainUrl } from "@acme/lib/url";
import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/components/button";

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
      href={subdomainUrl("app")}
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
