"use client";

import Image from "next/image";
import { Link2 } from "lucide-react";

import { GOOGLE_FAVICON_URL, SELF_REFERER } from "@acme/lib/constants";

import { useRouterStuff } from "~/hooks/use-router-stuff";
import { AnalyticsCard } from "../card";

interface Props {
  referers: {
    referer: string;
    count: number;
  }[];
}

export function AnalyticsRefers({ referers }: Props) {
  const { queryParams } = useRouterStuff();

  const items = referers.map((x) => {
    return {
      icon:
        x.referer === SELF_REFERER ? (
          <Link2 className="h-4 w-4" />
        ) : (
          <Image
            src={`${GOOGLE_FAVICON_URL}${x.referer}`}
            alt={x.referer}
            width={20}
            height={20}
            className="h-4 w-4 rounded-full"
          />
        ),
      title: x.referer,
      href: queryParams({
        getNewPath: true,
        set: {
          referer: x.referer,
        },
      })!,
      count: x.count,
    };
  });

  return (
    <AnalyticsCard
      title="Referers"
      barBackground="bg-red-100 dark:bg-red-900"
      items={items}
    />
  );
}
