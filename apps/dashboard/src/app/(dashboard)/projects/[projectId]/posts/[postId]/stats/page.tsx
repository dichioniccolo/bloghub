import type { ServerRuntime } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPost } from "~/app/_api/posts";
import { getProjectOwner } from "~/app/_api/projects";

interface Props {
  params: {
    projectId: string;
    postId: string;
  };
}

export const runtime: ServerRuntime = "edge";

export default async function Stats({ params: { projectId, postId } }: Props) {
  const post = await getPost(projectId, postId);

  if (!post) {
    return notFound();
  }

  const owner = await getProjectOwner(projectId);

  if (owner.usage > owner.quota) {
    return (
      <>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold">
              Analytics for {post.project.name} - {post.title ?? post.slug}
            </h1>
            <Link
              href={`https://${post.project.domain}/posts/${post.slug}`}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-stone truncate rounded-md px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
            >
              View the post ↗
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          You have exceeded your monthly visits. You won&apos; have access to
          statistics until you upgrade or wait for the next billing month
        </div>
      </>
    );
  }

  // const analytics = await getPostAnalytics(projectId, postId);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">
            Analytics for {post.project.name} - {post.title ?? post.slug}
          </h1>
          <Link
            href={`https://${post.project.domain}/posts/${post.slug}`}
            target="_blank"
            rel="noreferrer noopener"
            className="bg-stone truncate rounded-md px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
          >
            View the post ↗
          </Link>
        </div>
      </div>
      {/* <Analytics analytics={analytics} /> */}
    </>
  );
}
