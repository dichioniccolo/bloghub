"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Maximize, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@acme/ui/components/dialog";
import { Input } from "@acme/ui/components/input";

import { BarList } from "./bar-list";

interface Props {
  title: string;
  items: {
    icon?: ReactNode;
    title: string;
    href: string;
    count: number;
  }[];
  maxCount: number;
  barBackground: string;
}

export function AnalyticsModal({
  title,
  items,
  maxCount,
  barBackground,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(
    () =>
      items.filter((x) => x.title.toLowerCase().includes(search.toLowerCase())),
    [items, search],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="absolute inset-x-0 bottom-0 z-10 mx-auto flex w-full items-center justify-center space-x-2 rounded-md bg-gradient-to-b from-transparent to-white py-2 transition-all active:scale-95 dark:to-black">
          <Maximize className="h-4 w-4" />
          <p className="text-xs font-semibold uppercase">View all</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <div className="relative p-4">
          <div className="pointer-events-none absolute inset-y-0 left-7 flex items-center">
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="text"
            className="w-full py-2 pl-10 sm:text-sm"
            placeholder={`Search ${title}...`}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <div className="flex justify-between px-4 pb-1 pt-0">
            <p className="text-xs font-semibold uppercase text-gray-600">
              {title}
            </p>
            <p className="text-xs font-semibold uppercase text-gray-600">
              Visits
            </p>
          </div>
          <div className="h-[50vh] overflow-auto p-4 md:h-[40vh]">
            <BarList
              items={filteredItems}
              maxCount={maxCount}
              barBackground={barBackground}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
