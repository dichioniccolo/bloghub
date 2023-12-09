import { BarChart3, BookOpen } from "lucide-react";

import { Image } from "@acme/ui/components/image";

import { getPosts } from "~/app/_api/posts";
import { LATEST_POST_COUNT } from "./last-posts";
import { OtherPostsInfinite } from "./other-posts-infinite";

interface Props {
  projectId: string;
}

export async function OtherPosts({ projectId }: Props) {
  const posts = await getPosts(projectId, {
    offset: LATEST_POST_COUNT,
    limit: 9,
  });

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto mt-10 border-b pb-10 dark:border-slate-800">
      <OtherPostsInfinite projectId={projectId} initialPosts={posts} />
    </div>
  );
}

export function OtherPostsPlaceholder() {
  return (
    <div className="mx-auto mt-10 border-b pb-10 dark:border-slate-800">
      <div className="container mx-auto grid grid-cols-1 gap-10 p-4 md:grid-cols-2 lg:grid-cols-3 xl:p-10 2xl:px-24 2xl:py-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="col-span-1">
            <div className="group mb-4 block w-full overflow-hidden rounded-lg border bg-slate-100 hover:opacity-90 dark:border-slate-800 dark:bg-slate-800">
              <Image
                src={"/_static/placeholder.png"}
                alt={"Loading..."}
                className="block w-full transition-transform group-hover:scale-110"
              />
            </div>
            <h2 className="mx-4 mb-3 block text-xl font-extrabold text-slate-900 hover:opacity-75 dark:text-slate-100">
              ...
            </h2>
            <div className="mx-4 flex flex-row flex-wrap items-center">
              <div className="flex flex-col items-start leading-snug">
                <div className="flex flex-row text-sm">
                  <div className="flex flex-row items-center text-slate-500 dark:text-slate-400">
                    <span className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                    </span>
                    <p className="mx-2 font-bold">·</p>
                    <span className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>... visits</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
