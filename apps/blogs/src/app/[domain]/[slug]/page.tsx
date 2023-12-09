import { Suspense } from "react";
import type { Metadata, ServerRuntime } from "next";
import { unstable_noStore } from "next/cache";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/core";
import { format } from "date-fns";

import { Image } from "@acme/ui/components/image";
import { Link } from "@acme/ui/components/link";

import { getPostBySlug } from "~/app/_api/posts";
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
      creator: "bloghub",
    },
    icons: post?.project.logo ? [post.project.logo] : undefined,
  };
}

export default async function Page({ params: { domain, slug } }: Props) {
  unstable_noStore();
  const post = await getPostBySlug(domain, slug);

  if (!post) {
    return notFound();
  }

  return (
    <div className="relative z-40">
      <main className="pb-24">
        <article>
          <div className="container relative mx-auto grid grid-cols-8">
            <div className="col-span-full lg:col-span-6 lg:col-start-2">
              <div className="relative">
                <Image
                  src={post.thumbnailUrl ?? "/_static/placeholder.png"}
                  alt={post.title}
                  className="mb-0 block w-full"
                />
              </div>
              <div className="mb-5 mt-6 break-words px-4 text-center text-3xl font-extrabold text-slate-900 dark:text-white md:mt-10 md:px-5 md:text-4xl lg:px-8 xl:px-20 xl:text-5xl">
                <h1 className="leading-snug">{post.title}</h1>
              </div>
              <div className="mb-8 px-4 text-center md:mb-14 md:px-5 lg:px-8 xl:px-20">
                <h2 className="text-2xl leading-snug text-slate-700 dark:text-slate-400 md:text-3xl xl:text-3xl">
                  {post.description}
                </h2>
              </div>
              <div className="relative z-20 mb-8 flex flex-row flex-wrap items-center justify-center px-4 md:-mt-7 md:mb-14 md:text-lg last:md:mb-10">
                <div className="mb-5 flex w-full flex-row items-center justify-center md:mb-0 md:w-auto md:justify-start">
                  <span className="mx-3 hidden font-bold text-slate-500 md:block">
                    ·
                  </span>
                  <Link
                    href={post.slug}
                    className="text-slate-600 dark:text-slate-400"
                  >
                    <span>{format(post.createdAt, "MMM dd, yyyy")}</span>
                  </Link>
                  <span className="mx-3 hidden font-bold text-slate-500 md:block">
                    ·
                  </span>
                  {/* reading length */}
                </div>
              </div>
            </div>
          </div>
          <div className="container relative z-30 mx-auto grid grid-flow-row grid-cols-8 xl:gap-6 2xl:grid-cols-10">
            <section className="z-20 col-span-8 mb-10 px-4 md:z-10 lg:col-span-6 lg:col-start-2 lg:px-0 xl:col-span-6 xl:col-start-2 2xl:col-span-6 2xl:col-start-3">
              <div className="relative">
                {/* <div className="relative mb-10 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 pt-0 dark:border-slate-800 dark:bg-slate-900">
              <div className="max-h-full">
                table of contents
              </div>
            </div> */}
                <div className="relative mb-10 pb-14">
                  <div className="mx-auto mb-10 break-words">
                    {/* <div className="prose prose-lg mx-auto mb-10 break-words dark:prose-invert xl:prose-xl"> */}
                    <Viewer value={post.content as JSONContent} />
                  </div>
                </div>
                <div className="mb-5 flex w-full flex-row flex-wrap justify-center md:mb-0">
                  {/* tags */}
                </div>
              </div>
            </section>
          </div>
          <Suspense fallback={<p>Loading more posts...</p>}>
            <RandomPosts domain={domain} slug={slug} />
          </Suspense>
        </article>
      </main>
    </div>
  );
}
