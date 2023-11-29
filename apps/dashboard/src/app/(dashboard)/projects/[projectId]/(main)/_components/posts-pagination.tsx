"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { buttonVariants } from "@acme/ui/components/button";
import { Link } from "@acme/ui/components/link";

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
    <div className="sticky bottom-0 mt-4 flex h-20 flex-col items-center justify-center space-y-2 rounded-t-md border border-border bg-background shadow-lg">
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
              <AnchorLink value={1} />
              <Divider />
              <AnchorLink value={page - 1} />
              <AnchorLink value={page} />
              <AnchorLink value={page + 1} />
              <Divider />
              <AnchorLink value={paginationArray.length} />
            </>
          ) : page <= 3 ? (
            <>
              <AnchorLink value={1} />
              <AnchorLink value={2} />
              <AnchorLink value={3} />
              <Divider />
              <AnchorLink value={paginationArray.length} />
            </>
          ) : (
            <>
              <AnchorLink value={1} />
              <Divider />
              <AnchorLink value={paginationArray.length - 2} />
              <AnchorLink value={paginationArray.length - 1} />
              <AnchorLink value={paginationArray.length} />
            </>
          )
        ) : (
          paginationArray.map((i) => <AnchorLink key={i + 1} value={i + 1} />)
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

const AnchorLink = ({ value }: { value: number }) => {
  return (
    <Link
      href={{
        query: {
          page: value.toString(),
        },
      }}
      className={buttonVariants({
        className: "w-6",
        size: "sm",
      })}
    >
      {value}
    </Link>
  );
};
