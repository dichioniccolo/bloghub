import type { ReactNode } from "react";

import { ANALYTICS_MAX_CARD_ITEMS } from "@acme/lib/constants";

import { BarList } from "./bar-list";
import { AnalyticsModal } from "./modal";

interface Props {
  title: string;
  barBackground: string;
  actions?: ReactNode;
  items: {
    icon?: ReactNode;
    title: string;
    href: string;
    count: number;
  }[];
}

export function AnalyticsCard({ title, actions, barBackground, items }: Props) {
  const limitedItems = items.slice(0, ANALYTICS_MAX_CARD_ITEMS);

  return (
    <div className="relative z-0 h-[400px] overflow-hidden border bg-background px-7 py-5 sm:rounded-lg sm:shadow-lg">
      <div className="flex h-16 items-baseline justify-between">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="relative inline-flex items-center space-x-3">
          {actions}
        </div>
      </div>
      {limitedItems.length > 0 ? (
        <BarList
          items={limitedItems}
          maxCount={limitedItems[0]?.count ?? 0}
          barBackground={barBackground}
        />
      ) : (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-sm">No data available</p>
        </div>
      )}
      {items.length > ANALYTICS_MAX_CARD_ITEMS && (
        <AnalyticsModal
          title={title}
          items={items}
          maxCount={items[0]?.count ?? 0}
          barBackground={barBackground}
        />
      )}
    </div>
  );
}
