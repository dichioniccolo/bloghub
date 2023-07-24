import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/cn";

export function PostCardPlaceholder() {
  return (
    <Card className="relative animate-pulse overflow-hidden">
      <div className="absolute left-0 top-0 flex h-full w-2 flex-col">
        <div className={cn("h-full w-full animate-pulse bg-stone-400")} />
      </div>
      <CardHeader>
        <CardTitle>
          <Skeleton />
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <Skeleton />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-1">
            <Skeleton />
            <Skeleton />
          </div>
          <div className="flex items-center">
            <div className="mr-3 hidden whitespace-nowrap text-sm text-stone-500 sm:block">
              <Skeleton />
            </div>
            <div className="mr-1 whitespace-nowrap text-sm text-stone-500 sm:hidden">
              <Skeleton />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
