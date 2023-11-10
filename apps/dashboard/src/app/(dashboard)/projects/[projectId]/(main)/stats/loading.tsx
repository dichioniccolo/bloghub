import { Skeleton } from "@acme/ui/components/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">
            Analytics for <Skeleton />
          </h1>
          <Skeleton>
            <p className="bg-stone truncate rounded-md px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200">
              ... ↗
            </p>
          </Skeleton>
        </div>
      </div>
      <div className="flex items-center justify-center">Loading...</div>
    </>
  );
}
