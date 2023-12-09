"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, BookOpen } from "lucide-react";
import { useInView } from "react-intersection-observer";

import { Image } from "@acme/ui/components/image";

import { getPosts } from "~/app/_api/posts";
import { LATEST_POST_COUNT } from "./last-posts";
import { PostCard } from "./post-card";

interface Props {
  projectId: string;
  initialPosts: {
    id: string;
    slug: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    visits: number;
  }[];
}

const PER_PAGE = 9;

const skip = (page: number, perPage: number) => (page - 1) * perPage;

export function OtherPostsInfinite({ projectId, initialPosts }: Props) {
  const { ref, inView } = useInView();

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [noMorePosts, setNoMorePosts] = useState(false);

  const [page, setPage] = useState(1);

  const loadMorePosts = useCallback(async () => {
    const next = page + 1;

    const newPosts = await getPosts(projectId, {
      offset: skip(next, PER_PAGE) + LATEST_POST_COUNT,
      limit: PER_PAGE,
    });

    if (newPosts.length === 0) {
      setNoMorePosts(true);
      return;
    }

    setPage(next);
    setPosts((posts) => [...posts, ...newPosts]);
  }, [page, projectId]);

  useEffect(() => {
    if (!inView) {
      return;
    }

    setLoading(true);
    loadMorePosts()
      .then(() => {
        //
      })
      .catch(() => {
        //
      })
      .finally(() => {
        setLoading(false);
      });
  }, [inView, loadMorePosts]);

  return (
    <>
      <div className="container mx-auto grid grid-cols-1 gap-10 p-4 md:grid-cols-2 lg:grid-cols-3 xl:p-10 2xl:px-24 2xl:py-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {!loading && !noMorePosts && <div ref={ref}></div>}
        {loading && (
          <>
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
          </>
        )}
      </div>

      {noMorePosts && (
        <div className="px-16 py-8 text-center font-bold text-slate-700 dark:text-slate-300">
          <p className="text-2xl">You&apos;ve reached the end!</p>
        </div>
      )}
    </>
  );
}
