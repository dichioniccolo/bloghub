import { Suspense } from "react";
import type { Metadata, ServerRuntime } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/core";
import { format } from "date-fns";

import { getPostBySlug } from "~/app/_api/public/posts";
import { RandomPosts } from "./_components/random-posts";
import { Viewer } from "./_components/viewer";

interface Props {
  params: {
    domain: string;
    slug: string;
  };
}

export const runtime: ServerRuntime = "edge";

export async function generateMetadata({
  params: { domain, slug },
}: Props): Promise<Metadata> {
  const post = await getPostBySlug(domain, slug);

  const title = `${post?.title} | ${post?.project.name}`;
  const description = post?.description ?? undefined;

  const seoTitle = `${post?.seoTitle ?? post?.title} | ${post?.project.name}`;
  const seoDescription = post?.seoDescription ?? post?.description ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      creator: "@acme",
    },
    icons: post?.project.logo ? [post.project.logo] : undefined,
  };
}

export default async function Page({ params: { domain, slug } }: Props) {
  const post = await getPostBySlug(domain, slug);

  if (!post) {
    return notFound();
  }

  return (
    <>
      <div className="my-20">
        <div className="flex flex-col items-center justify-center">
          <div className="m-auto w-full text-center md:w-7/12">
            <p className="m-auto my-5 w-10/12 text-sm font-light text-muted-foreground md:text-base">
              {format(post.createdAt, "MMMM dd, yyyy")}
            </p>
            <h1 className="mb-10 text-3xl font-bold text-primary md:text-6xl">
              {post.title}
            </h1>
            <p className="text-md m-auto w-10/12 text-secondary-foreground md:text-lg">
              {post.description}
            </p>
          </div>
          {/** add who created this post, if it's a team, we need to decide who to show */}
        </div>
      </div>
      <div className="relative m-auto mb-10 h-80 w-full max-w-screen-lg overflow-hidden md:mb-20 md:h-[37.5rem] md:w-5/6 md:rounded-2xl lg:w-2/3">
        <Image
          alt={post.title ?? "Post image"}
          width={1200}
          height={630}
          className="h-full w-full object-cover"
          src={post.thumbnailUrl ?? "/_static/placeholder.png"}
        />
      </div>
      <div className="mx-10 my-10 md:mx-20">
        <Viewer value={post.content as JSONContent} />
      </div>
      <Suspense fallback={<p>loading...</p>}>
        <RandomPosts domain={domain} slug={slug} />
      </Suspense>
    </>
  );
}
