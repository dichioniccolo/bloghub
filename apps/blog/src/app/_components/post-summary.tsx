import Link from "next/link";
import { formatDistance, formatISO } from "date-fns";

import { BlogRoutes } from "@acme/common/routes";

import { Icons } from "~/app/_components/icons";
import { type GetPostsProjectByDomain } from "~/app/actions/posts";

type Props = {
  post: GetPostsProjectByDomain[number];
};

export function PostSummary({ post }: Props) {
  return (
    <div>
      <Link href={BlogRoutes.Post(post.slug)}>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {post.title}
        </h2>
      </Link>

      <div className="mt-2">
        <p className="tracking-tight text-secondary-foreground">
          <time dateTime={formatISO(post.createdAt)}>
            {formatDistance(post.createdAt, new Date(), { addSuffix: true })}
          </time>
        </p>
      </div>
      <p className="mt-4">{post.description}</p>
      <div className="clear-both mt-4 flex items-center gap-4">
        <Link
          href={BlogRoutes.Post(post.slug)}
          className="text-blue inline-flex items-center font-medium transition-colors"
        >
          Continue reading <Icons.chevronRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
