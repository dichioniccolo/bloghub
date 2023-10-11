"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@acme/ui";

interface Props {
  itemsCount: number;
}

export function PostsPagination({ itemsCount }: Props) {
  const searchParams = useSearchParams();

  const currentPage: number =
    searchParams.get("page") && typeof searchParams.get("page") === "string"
      ? parseInt(searchParams.get("page")!)
      : 1;

  const pageSize: number =
    searchParams.get("pageSize") &&
    typeof searchParams.get("pageSize") === "string"
      ? parseInt(searchParams.get("pageSize")!)
      : 5;

  const paginatedCount = Math.ceil(itemsCount / pageSize);
  const paginationArray = !isNaN(paginatedCount)
    ? Array.from(Array(paginatedCount).keys())
    : [];

  return (
    <div className="sticky bottom-0 mt-4 flex h-20 flex-col items-center justify-center space-y-2 rounded-t-md border border-border shadow-lg">
      <div className="flex items-center space-x-2">
        {currentPage > 1 && paginatedCount > 5 && (
          <Link
            href={{
              query: {
                page: (currentPage - 1).toString(),
              },
            }}
            className="flex min-w-[1.5rem] items-center justify-center rounded-md bg-white p-1 transition-all hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
        {paginationArray.length > 6 ? (
          currentPage > 3 && currentPage < paginationArray.length - 2 ? (
            <>
              <AnchorLink value={1} />
              <Divider />
              <AnchorLink value={currentPage - 1} />
              <AnchorLink value={currentPage} />
              <AnchorLink value={currentPage + 1} />
              <Divider />
              <AnchorLink value={paginationArray.length} />
            </>
          ) : currentPage <= 3 ? (
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
        {currentPage < paginatedCount && paginatedCount > 5 && (
          <Link
            href={{
              query: {
                page: (currentPage + 1).toString(),
              },
            }}
            className="flex min-w-[1.5rem] items-center justify-center rounded-md bg-white p-1 transition-all hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <p className="text-sm text-gray-500">
        Showing {(currentPage - 1) * pageSize + 1} -{" "}
        {Math.min(currentPage * pageSize, itemsCount)} of{" "}
        <span>{itemsCount}</span> items
      </p>
    </div>
  );
}

const Divider = () => {
  return <div className="w-6 rounded-lg border border-gray-400" />;
};

const AnchorLink = ({ value }: { value: number }) => {
  const searchParams = useSearchParams();

  const currentPage: number =
    searchParams.get("page") && typeof searchParams.get("page") === "string"
      ? parseInt(searchParams.get("page")!)
      : 1;

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
          "text-black": value === currentPage,
          "text-gray-400": value !== currentPage,
        },
      )}
    >
      {value}
    </Link>
  );
};
