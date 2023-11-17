"use client";

import { constructPostUrl } from "@acme/lib/url";

import { useRouterStuff } from "~/hooks/use-router-stuff";
import { AnalyticsCard } from "../card";

interface Props {
  posts: {
    domain: string;
    slug: string;
    count: number;
  }[];
}

export function AnalyticsPosts({ posts }: Props) {
  const { queryParams } = useRouterStuff();

  const items = posts.map((x) => {
    return {
      title: constructPostUrl(x.domain, x.slug, {
        withProtocol: false,
      }),
      href: queryParams({
        getNewPath: true,
        set: {
          slug: x.slug,
        },
      })!,
      count: x.count,
    };
  });

  return (
    <AnalyticsCard
      title="Posts"
      barBackground="bg-blue-100 dark:bg-blue-900"
      items={items}
    />
  );
}
