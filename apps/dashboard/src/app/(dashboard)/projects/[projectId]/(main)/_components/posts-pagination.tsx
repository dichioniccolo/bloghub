"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@acme/ui";

interface Props {
  pagination: {
    page: number;
    pageSize: number;
  };
  itemsCount: number;
}

export function PostsPagination({ pagination, itemsCount }: Props) {
  const { page, pageSize } = pagination;

  const paginatedCount = Math.ceil(itemsCount / pageSize);
  const paginationArray = !isNaN(paginatedCount)
    ? Array.from(Array(paginatedCount).keys())
    : [];

  return (
    <div className="sticky bottom-0 mt-4 flex h-20 flex-col items-center justify-center space-y-2 rounded-t-md border border-border shadow-lg">
      <div className="flex items-center space-x-2">
        {page > 1 && paginatedCount > 5 && (
          <Link
            href={{
              query: {
                page: (page - 1).toString(),
              },
            }}
            className="flex min-w-[1.5rem] items-center justify-center rounded-md bg-white p-1 transition-all hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
        {paginationArray.length > 6 ? (
          page > 3 && page < paginationArray.length - 2 ? (
            <>
              <AnchorLink page={page} value={1} />
              <Divider />
              <AnchorLink page={page} value={page - 1} />
              <AnchorLink page={page} value={page} />
              <AnchorLink page={page} value={page + 1} />
              <Divider />
              <AnchorLink page={page} value={paginationArray.length} />
            </>
          ) : page <= 3 ? (
            <>
              <AnchorLink page={page} value={1} />
              <AnchorLink page={page} value={2} />
              <AnchorLink page={page} value={3} />
              <Divider />
              <AnchorLink page={page} value={paginationArray.length} />
            </>
          ) : (
            <>
              <AnchorLink page={page} value={1} />
              <Divider />
              <AnchorLink page={page} value={paginationArray.length - 2} />
              <AnchorLink page={page} value={paginationArray.length - 1} />
              <AnchorLink page={page} value={paginationArray.length} />
            </>
          )
        ) : (
          paginationArray.map((i) => (
            <AnchorLink key={i + 1} page={page} value={i + 1} />
          ))
        )}
        {page < paginatedCount && paginatedCount > 5 && (
          <Link
            href={{
              query: {
                page: (page + 1).toString(),
              },
            }}
            className="flex min-w-[1.5rem] items-center justify-center rounded-md bg-white p-1 transition-all hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <p className="text-sm text-gray-500">
        Showing {(page - 1) * pageSize + 1} -{" "}
        {Math.min(page * pageSize, itemsCount)} of <span>{itemsCount}</span>{" "}
        items
      </p>
    </div>
  );
}

const Divider = () => {
  return <div className="w-6 rounded-lg border border-gray-400" />;
};

const AnchorLink = ({ value, page }: { value: number; page: number }) => {
  return (
    <Link
      href={{
        query: {
          page: value.toString(),
        },
      }}
      className={cn(
        "flex min-w-[1.5rem] items-center justify-center rounded-md bg-white p-1 font-semibold transition-all hover:bg-gray-100",
        {
          "text-black": value === page,
          "text-gray-400": value !== page,
        },
      )}
    >
      {value}
    </Link>
  );
};
