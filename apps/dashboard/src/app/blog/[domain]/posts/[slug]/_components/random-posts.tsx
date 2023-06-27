import { getRandomPostsByDomain } from "~/app/_api/public/posts";
import { PostCard } from "~/app/blog/[domain]/_components/post-card";

type Props = {
  domain: string;
  slug: string;
};

export async function RandomPosts({ domain, slug }: Props) {
  const randomPosts = await getRandomPostsByDomain(domain, slug);

  if (randomPosts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="relative mb-20 mt-10 sm:mt-20">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-sm">Continue Reading</span>
        </div>
      </div>

      <div className="mx-5 mb-20 grid max-w-screen-xl grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:mx-12 xl:grid-cols-3 2xl:mx-auto">
        {randomPosts.map((randomPost) => (
          <PostCard key={randomPost.id} post={randomPost} />
        ))}
      </div>
    </>
  );
}
