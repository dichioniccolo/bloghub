import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/cn";

export function PostCardPlaceholder() {
  return (
    <Card className="relative animate-pulse overflow-hidden">
      <div className="absolute left-0 top-0 flex h-full w-2 flex-col">
        <div className={cn("h-full w-full animate-pulse bg-gray-400")} />
      </div>
      <CardHeader>
        <CardTitle>
          <Skeleton />
        </CardTitle>
        <CardDescription>
          <Skeleton />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-1">
            <Skeleton />
            <Skeleton />
          </div>
          <div className="flex items-center">
            <p className="mr-3 hidden whitespace-nowrap text-sm text-gray-500 sm:block">
              Added <Skeleton />
            </p>
            <p className="mr-1 whitespace-nowrap text-sm text-gray-500 sm:hidden">
              <Skeleton />
            </p>
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
