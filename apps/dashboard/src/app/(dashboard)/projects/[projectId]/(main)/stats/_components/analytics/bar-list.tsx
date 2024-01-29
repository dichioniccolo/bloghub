"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { UNKNOWN_ANALYTICS_VALUE } from "@acme/lib/constants";
import { formatNumber } from "@acme/lib/utils";
import { cn } from "@acme/ui";

interface Props {
  items: {
    icon?: ReactNode;
    title: string;
    href: string;
    count: number;
  }[];
  maxCount: number;
  barBackground: string;
}

export function BarList({ items, maxCount, barBackground }: Props) {
  return (
    <div className="grid gap-4">
      {items.map(({ icon, title, href, count }, index) => {
        return (
          <Link key={index} href={href} scroll={false}>
            <div className="group flex items-center justify-between">
              <div className="relative z-10 flex w-full max-w-[calc(100%-2rem)] items-center">
                <div className="z-10 flex items-center space-x-2 px-2">
                  {title === UNKNOWN_ANALYTICS_VALUE ? null : icon}
                  <p
                    className={cn("max-w-[20rem] truncate text-sm", {
                      "underline-offset-4 group-hover:underline": !!href,
                    })}
                  >
                    {title}
                  </p>
                </div>
                <motion.div
                  style={{
                    width: `${(count / (maxCount || 0)) * 100}%`,
                  }}
                  className={cn(
                    "absolute h-8 origin-left rounded-sm",
                    barBackground,
                  )}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                  initial={{ transform: "scaleX(0)" }}
                  animate={{ transform: "scaleX(1)" }}
                />
              </div>
              <p className="z-10 text-sm">{formatNumber(count)}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
