import { Plus } from "lucide-react";

import { Button } from "@acme/ui/components/button";
import { Input } from "@acme/ui/components/input";
import { Skeleton } from "@acme/ui/components/skeleton";

import { DashboardHeader } from "~/components/dashboard-header";
import { DashboardShell } from "~/components/dashboard-shell";
import { PostsCardsPlaceholder } from "./_components/posts-cards-placeholder";

export default function Loading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Posts">
        <Skeleton>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </Skeleton>
      </DashboardHeader>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-7">
        <div className="sticky top-32 col-span-2 hidden max-h-[calc(100vh-150px)] self-start overflow-auto rounded-lg border border-border bg-background shadow lg:block">
          <div className="grid w-full rounded-md px-5 lg:divide-y lg:divide-border">
            <div className="grid gap-3 py-6">
              <div className="flex items-center justify-between">
                <h3 className="ml-1 mt-2 font-semibold">Filter Posts</h3>
              </div>
              <Input disabled placeholder="Search..." />
            </div>
          </div>
        </div>
        <PostsCardsPlaceholder />
      </div>
    </DashboardShell>
  );
}
