"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@acme/ui/components/input";
import { useDebounce } from "@acme/ui/hooks/use-debounce";

import { AppRoutes } from "~/lib/routes";

interface Props {
  projectId: string;
}

export function FilterPosts({ projectId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q =
    searchParams.get("q") && typeof searchParams.get("q") === "string"
      ? searchParams.get("q")!
      : "";

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const value = debouncedQuery.trim();

    const searchParams = new URLSearchParams(window.location.search);
    if (!debouncedQuery) {
      searchParams.delete("q");
    } else {
      searchParams.set("q", value);
    }

    router.push(
      `${AppRoutes.ProjectDashboard(projectId)}?${searchParams.toString()}`,
    );
  }, [debouncedQuery, projectId, router]);

  return (
    <div className="sticky top-32 col-span-2 hidden max-h-[calc(100vh-150px)] self-start overflow-auto rounded-lg border border-gray-100 bg-white shadow lg:block">
      <div className="grid w-full rounded-md bg-white px-5 lg:divide-y lg:divide-border">
        <div className="grid gap-3 py-6">
          <div className="flex items-center justify-between">
            <h3 className="ml-1 mt-2 font-semibold">Filter Posts</h3>
          </div>
          <Input
            value={query}
            defaultValue={q ?? ""}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
          />
        </div>
      </div>
    </div>
  );
}
