import { notFound } from "next/navigation";

import { getProjectByDomain } from "~/app/actions/projects";
import { Pagination } from "./pagination";
import { PostSummary } from "./post-summary";

type Props = {
  params: {
    domain: string;
  };
  searchParams?: {
    page?: string;
  };
};

export const dynamic = "force-dynamic";

const POSTS_PER_PAGE = 1;

export default async function Page({
  params: { domain },
  searchParams,
}: Props) {
  const page = parseInt(searchParams?.page ?? "1");

  const { project, posts, postsCount } = await getProjectByDomain(
    domain,
    page,
    POSTS_PER_PAGE,
  );

  if (!project) {
    return notFound();
  }

  if (posts.length === 0) {
    return (
      <div className="rounded border px-10 py-20 text-center text-secondary">
        There are no published posts to show yet.
      </div>
    );
  }

  return (
    <>
      <div className="flow-root">
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
      />
    </>
  );
}
