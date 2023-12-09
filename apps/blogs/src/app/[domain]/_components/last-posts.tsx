import { BarChart3, BookOpen } from "lucide-react";

import { cn } from "@acme/ui";
import { Image } from "@acme/ui/components/image";

import { getPosts } from "~/app/_api/posts";
import { PostCard } from "./post-card";

interface Props {
  projectId: string;
}

export const LATEST_POST_COUNT = 3;

export async function LastPosts({ projectId }: Props) {
  const posts = await getPosts(projectId, {
    offset: 0,
    limit: LATEST_POST_COUNT,
  });

  return (
    <div className="mx-auto border-b bg-slate-50 dark:border-slate-800 dark:bg-black">
      <div className="container mx-auto grid grid-cols-1 gap-8 p-4 md:grid-flow-col md:grid-cols-2 md:grid-rows-2 xl:grid-cols-3 xl:p-10 2xl:px-24 2xl:py-10">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} expand={index === 0} />
        ))}
      </div>
    </div>
  );
}

export function LastPostsPlaceholder() {
  return (
    <div className="mx-auto border-b bg-slate-50 dark:border-slate-800 dark:bg-black">
      <div className="container mx-auto grid grid-cols-1 gap-8 p-4 md:grid-flow-col md:grid-cols-2 md:grid-rows-2 xl:grid-cols-3 xl:p-10 2xl:px-24 2xl:py-10">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={cn("col-span-1", {
              "md:row-span-2 xl:col-span-2": index === 0,
            })}
          >
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
            <p className="mx-4 mb-3 break-words text-lg leading-snug text-slate-500 hover:opacity-75 dark:text-slate-400">
              ...
            </p>
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
