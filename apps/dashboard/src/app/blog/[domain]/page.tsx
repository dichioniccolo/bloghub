import type { ServerRuntime } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AspectRatio } from "~/components/ui/aspect-ratio";
import { getPostsByDomain } from "~/app/_api/public/posts";
import { getProjectByDomain } from "~/app/_api/public/projects";
import { env } from "~/env.mjs";
import { cn } from "~/lib/cn";

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

  const firstThreePosts = posts.slice(0, 3);
  const otherPosts = posts.slice(3);

  return (
    <>
      <div className="border-b border-border">
        <div className="grid w-full grid-cols-2 grid-rows-2 gap-8 p-4">
          {firstThreePosts.map((post, index) => (
            <div
              key={post.id}
              className={cn("col-span-1 flex", {
                "row-span-2": index === 0,
                "row-span-1": index > 0,
              })}
            >
              <Link
                href={`/posts/${post.slug}`}
                title={`Link to the post titled ${post.title}`}
                className="group h-full flex-1"
              >
                {post.thumbnailUrl && (
                  <span className="block overflow-hidden">
                    <AspectRatio ratio={16 / 9}>
                      <Image src={post.thumbnailUrl} alt={post.title} fill />
                    </AspectRatio>
                  </span>
                )}
                <h2 className="break-words text-2xl leading-loose group-hover:text-muted-foreground">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="break-words">{post.description}</p>
                )}
                <div className="flex justify-between">
                  <span></span>
                  <span>
                    {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-8">
          {otherPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              title={`Link to the post titled ${post.title}`}
              className="group"
            >
              {post.thumbnailUrl && (
                <span className="block overflow-hidden">
                  <AspectRatio ratio={16 / 9}>
                    <img src={post.thumbnailUrl} alt={post.title} />
                  </AspectRatio>
                </span>
              )}

              <h2 className="break-words text-2xl leading-loose">
                {post.title}
              </h2>
            </Link>
          ))}
        </div>
        {/* <div className="flow-root">
        <ul className="-my-12 divide-y divide-primary">
          {posts.map((post) => (
            <li key={post.id} className="py-10">
              <PostSummary post={post} />
            </li>
          ))}
        </ul>
      </div>
      <Pagination
        currentPageNumber={page}
        itemCount={postsCount}
        itemsPerPage={POSTS_PER_PAGE}
      /> */}
      </div>
    </>
  );
}
