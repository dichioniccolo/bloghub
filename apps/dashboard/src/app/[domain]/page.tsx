import type { ServerRuntime } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";

import { getPostsByDomain } from "~/app/_api/public/posts";
import { getProjectByDomain } from "~/app/_api/public/projects";
import { env } from "~/env.mjs";
import { BlogRoutes } from "~/lib/common/routes";
import { PostCard } from "./_components/post-card";

type Props = {
  params: {
    domain: string;
  };
  searchParams?: {
    page?: string;
  };
};

export const runtime: ServerRuntime = "edge";
export const dynamic = "force-dynamic";

const POSTS_PER_PAGE = 10;

export default async function Page({
  params: { domain },
  searchParams,
}: Props) {
  const page = parseInt(searchParams?.page ?? "1");

  const project = await getProjectByDomain(domain);

  if (!project) {
    redirect(env.NEXT_PUBLIC_APP_DOMAIN);
  }

  const { posts } = await getPostsByDomain(domain, page, POSTS_PER_PAGE);

  // const firstThreePosts = posts.slice(0, 3);
  // const otherPosts = posts.slice(3);

  // TODO: make it better, I don't like it at all, but it works just for starters
  return (
    <>
      <div className="mb-20 w-full">
        {posts.length > 0 ? (
          <div className="mx-auto w-full max-w-screen-xl md:mb-28 lg:w-5/6">
            <Link href={BlogRoutes.Post(posts[0]!.slug)}>
              <div className="sm:h-150 group relative mx-auto h-80 w-full overflow-hidden lg:rounded-xl">
                <Image
                  alt={posts[0]!.title ?? ""}
                  className="h-full w-full object-cover group-hover:scale-105 group-hover:duration-300"
                  width={1300}
                  height={630}
                  src={posts[0]!.thumbnailUrl ?? "/placeholder.png"}
                />
              </div>
              <div className="mx-auto mt-10 w-5/6 lg:w-full">
                <h2 className="font-title my-10 text-4xl md:text-6xl">
                  {posts[0]!.title}
                </h2>
                <p className="w-full text-base md:text-lg lg:w-2/3">
                  {posts[0]!.description}
                </p>
                <div className="flex w-full items-center justify-start space-x-4">
                  <p className="my-5 text-sm font-light text-muted-foreground md:text-base">
                    {format(posts[0]!.createdAt, "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Image
              alt="missing post"
              src="https://illustrations.popsy.co/gray/success.svg"
              width={400}
              height={400}
              className="dark:hidden"
            />
            <Image
              alt="missing post"
              src="https://illustrations.popsy.co/white/success.svg"
              width={400}
              height={400}
              className="hidden dark:block"
            />
            <p className="font-title text-2xl text-stone-600 dark:text-stone-400">
              No posts yet.
            </p>
          </div>
        )}
      </div>

      {posts.length > 1 && (
        <div className="mx-5 mb-20 max-w-screen-xl lg:mx-24 2xl:mx-auto">
          <h2 className="font-title mb-10 text-4xl dark:text-white md:text-5xl">
            More posts
          </h2>
          <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
            {posts.slice(1).map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
