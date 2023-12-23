import { Skeleton } from "@acme/ui/components/ui/skeleton";

export default function Loading() {
  return (
    <Skeleton>
      <div className="mx-auto flex h-[calc(100vh-14rem)] w-full max-w-screen-sm flex-col items-center" />
    </Skeleton>
  );
}
