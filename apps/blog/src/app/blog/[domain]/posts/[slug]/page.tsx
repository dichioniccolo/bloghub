import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import { BlurImage, HtmlView } from "@acme/ui";

import { PostCard } from "~/app/_components/post-card";
import { getPostBySlug, getRandomPostsByDomain } from "~/app/actions/posts";
import { summarize, thumbnail } from "~/lib/text";

type Props = {
  params: {
    domain: string;
    slug: string;
  };
};

export async function generateMetadata({
  params: { domain, slug },
}: Props): Promise<Metadata> {
  const post = await getPostBySlug(domain, slug);

  const { summary } = summarize(post?.contentHtml || "");

  return {
    title: `${post?.title} | ${post?.project.name}'s Blog`,
    description: summary,
  };
}

export default async function Page({ params: { domain, slug } }: Props) {
  const [post, randomPosts] = await Promise.all([
    getPostBySlug(domain, slug),
    getRandomPostsByDomain(domain, slug),
  ]);

  if (!post) {
    return notFound();
  }

  const { summary } = summarize(post?.contentHtml || "");
  const img = thumbnail(post?.contentHtml || "");

  return (
    <>
      <div className="my-20">
        <div className="flex flex-col items-center justify-center">
          <div className="m-auto w-full text-center md:w-7/12">
            <p className="m-auto my-5 w-10/12 text-sm font-light text-muted-foreground md:text-base">
              {format(post.createdAt, "MMMM dd, yyyy")}
            </p>
            <h1 className="font-cal mb-10 text-3xl font-bold text-primary md:text-6xl">
              {post.title}
            </h1>
            <HtmlView
              html={summary}
              className="text-md m-auto w-10/12 text-secondary-foreground md:text-lg"
            />
          </div>
          {/** add who created this post */}
        </div>
      </div>

      {img && (
        <div className="md:h-150 relative m-auto mb-10 h-80 w-full max-w-screen-lg overflow-hidden md:mb-20 md:w-5/6 md:rounded-2xl lg:w-2/3">
          <BlurImage
            alt={post.title}
            src={img}
            width={1280}
            height={720}
            className="h-full w-full scale-100 object-cover blur-0 grayscale-0 duration-700 ease-in-out"
          />
        </div>
      )}
      <HtmlView
        html={post.contentHtml}
        className="m-auto w-11/12 sm:w-3/4"
        as="article"
      />
      <div className="relative mb-20 mt-10 sm:mt-20">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-sm">Continue Reading</span>
        </div>
      </div>
      {randomPosts.length === 0 ? (
        <div className="mb-20 flex w-full items-center justify-center">
          <p className="text-2xl font-semibold text-muted-foreground">
            No posts found
          </p>
        </div>
      ) : (
        <div className="mx-5 mb-20 grid max-w-screen-xl grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:mx-12 xl:grid-cols-3 2xl:mx-auto">
          {randomPosts.map((randomPost) => (
            <PostCard key={randomPost.id} post={randomPost} />
          ))}
        </div>
      )}
    </>
  );
}
