import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "~/lib/cn";
import { BlogRoutes } from "~/lib/common/routes";

type Props = {
  itemCount: number;
  currentPageNumber: number;
  itemsPerPage: number;
};

export function Pagination({
  itemCount,
  itemsPerPage,
  currentPageNumber,
}: Props) {
  const totalPages = Math.ceil(itemCount / itemsPerPage);

  return (
    <div className="mt-12 flex justify-center gap-4">
      <Link
        href={{
          href: BlogRoutes.Home,
          query: { page: currentPageNumber - 1 },
        }}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          "h-9 rounded-md px-3",
          {
            "pointer-events-none opacity-50": currentPageNumber === 1,
          },
        )}
      >
        <ChevronLeft className="mr-1" />
        Newer posts
      </Link>
      <Link
        href={{
          href: BlogRoutes.Home,
          query: { page: currentPageNumber + 1 },
        }}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          "h-9 rounded-md px-3",
          {
            "pointer-events-none opacity-50": currentPageNumber === totalPages,
          },
        )}
      >
        Older posts
        <ChevronRight className="ml-1" />
      </Link>
    </div>
  );
}
