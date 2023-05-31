import { notFound } from "next/navigation";

import { getProjectByDomain } from "~/app/actions/projects";
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

export default async function Page({
  params: { domain },
  searchParams,
}: Props) {
  const page = parseInt(searchParams?.page ?? "1");

  const { project, hasMorePages } = await getProjectByDomain(domain, page);

  if (!project) {
    return notFound();
  }

  if (project.posts.length === 0 && !hasMorePages) {
    return (
      <div className="rounded border px-10 py-20 text-center text-secondary">
        There are no published posts to show yet.
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-my-12 divide-y divide-primary">
        {project.posts.map((post) => (
          <li key={post.id} className="py-10">
            <PostSummary post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
