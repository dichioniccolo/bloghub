import { BarChart2, Copy, MoreVertical } from "lucide-react";

import { cn } from "@acme/ui";
import { Skeleton } from "@acme/ui/components/skeleton";

import { PostCardButton } from "./post-card/post-card-button";

export function PostCardPlaceholder() {
  return (
    <Skeleton
      className={cn(
        "relative rounded-lg border-2 border-border bg-white p-3 pr-1 shadow transition-all hover:shadow-md sm:p-4",
      )}
    >
      <li className="relative flex items-center justify-between">
        <div className="relative flex shrink items-center">
          <Skeleton
            className={cn("h-8 w-2 rounded-lg bg-gray-500 blur-0 sm:h-10")}
          />
          <div className="ml-2 sm:ml-4">
            <div className="flex max-w-fit items-center space-x-2">
              <p className="w-full max-w-[140px] truncate text-sm font-semibold sm:max-w-[300px] sm:text-base md:max-w-[360px] xl:max-w-[500px]">
                ...
              </p>
              <PostCardButton className="rounded-md px-1 py-2">
                <span className="sr-only">Copy</span>
                <Copy size={14} />
              </PostCardButton>
            </div>
            <div className="flex max-w-fit items-center space-x-1">
              <p className="whitespace-nowrap text-sm text-gray-500">...</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="hidden items-center space-x-1 rounded-md bg-gray-100 px-2 py-0.5 transition-all hover:scale-105 active:scale-100 md:inline-flex">
            <BarChart2 className="h-4 w-4" />
            <p className="whitespace-nowrap text-sm text-muted-foreground">
              ...
              <span className="ml-1 hidden sm:inline-block">visits</span>
            </p>
          </Skeleton>
          <PostCardButton disabled className="rounded-md px-1 py-2">
            <span className="sr-only">Menu</span>
            <MoreVertical className="h-5 w-5" />
          </PostCardButton>
        </div>
      </li>
    </Skeleton>
  );
}
