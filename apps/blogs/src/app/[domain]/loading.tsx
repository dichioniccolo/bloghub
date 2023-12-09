import { LastPostsPlaceholder } from "./_components/last-posts";
import { OtherPostsPlaceholder } from "./_components/other-posts";

export default function Loading() {
  return (
    <>
      <div className="mx-auto border-b bg-slate-50 dark:border-slate-800 dark:bg-black">
        <LastPostsPlaceholder />
      </div>
      <div className="mx-auto mt-10 border-b pb-10 dark:border-slate-800">
        <OtherPostsPlaceholder />
      </div>
    </>
  );
}
