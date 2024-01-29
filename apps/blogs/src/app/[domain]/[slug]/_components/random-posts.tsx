import { unstable_noStore } from "next/cache";

import { BlogRoutes } from "@acme/lib/routes";
import { Image } from "@acme/ui/components/image";
import { Link } from "@acme/ui/components/link";

import { getRandomPostsByDomain } from "~/app/_api/posts";

interface Props {
  domain: string;
  postId: string;
}

export async function RandomPosts({ domain, postId }: Props) {
  unstable_noStore();
  const randomPosts = await getRandomPostsByDomain(domain, postId);

  if (randomPosts.length === 0) {
    return null;
  }

  return (
    <div className="mb-20 mt-10">
      <h3 className="mb-5 text-center font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        More posts
      </h3>
      <div className="container mx-auto grid grid-flow-row grid-cols-6 px-4 xl:grid-cols-9 xl:gap-6 2xl:px-0">
        {randomPosts.map((post) => (
          <Link
            key={post.id}
            href={BlogRoutes.Post(post)}
            className="col-span-full mb-5 px-2 md:col-span-3 lg:col-span-2 lg:mb-0 xl:col-span-3"
          >
            <div className="h-full rounded-lg border p-4 dark:border-slate-800">
              <div className="mb-3 block rounded border bg-cover bg-center dark:border-slate-800">
                <Image
                  src={post.thumbnailUrl ?? "/_static/placeholder.png"}
                  alt={post.title}
                />
              </div>
              <div className="break-words">
                <h2 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                  {post.title}
                </h2>
                <p className="text-base text-slate-700 dark:text-slate-400">
                  {post.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
