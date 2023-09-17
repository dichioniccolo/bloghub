import { BarChart2, MoreVertical } from "lucide-react";

import { cn } from "@acme/ui";
import { Skeleton } from "@acme/ui/components/skeleton";

import { PostCardButton } from "./post-card/post-card-button";

export function PostCardPlaceholder() {
  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-border p-3 pr-2 shadow transition-all hover:shadow-md sm:p-4",
      )}
    >
      <div className="absolute left-0 top-0 flex h-full w-2 flex-col">
        <Skeleton className="h-full w-full rounded-l-lg" />
      </div>
      <li className="relative flex items-center justify-between">
        <div className="relative flex shrink items-center">
          <div>
            <div className="flex max-w-fit items-center space-x-2">
              <Skeleton className="h-4 w-40 max-w-[170px] truncate text-sm font-semibold text-accent-foreground sm:max-w-[300px] sm:text-base md:max-w-[360px] xl:max-w-[500px]" />
            </div>
            <div className="flex max-w-fit items-center space-x-1">
              <div className="whitespace-nowrap text-sm text-muted-foreground">
                <Skeleton className="h-4 w-20" />
              </div>
              <p>•</p>
              <Skeleton className="h-4 w-60 max-w-[180px] truncate text-sm font-medium underline-offset-2 hover:underline sm:max-w-[300px] md:max-w-[360px] xl:max-w-[500px]" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton>
            <PostCardButton
              disabled
              className="space-x-1 rounded-md px-2 py-0.5"
            >
              <BarChart2 className="h-4 w-4" />
              <p className="whitespace-nowrap text-sm text-muted-foreground">
                <Skeleton className="h-4 w-10" />
              </p>
            </PostCardButton>
          </Skeleton>
          <Skeleton>
            <PostCardButton disabled className="rounded-md px-1 py-2">
              <span className="sr-only">Menu</span>
              <MoreVertical className="h-5 w-5" />
            </PostCardButton>
          </Skeleton>
        </div>
      </li>
    </div>
  );
}
