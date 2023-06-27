import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import { BlogRoutes } from "~/lib/common/routes";
import { type GetRandomPostsByDomain } from "../_actions/posts";

type Props = {
  post: GetRandomPostsByDomain[number];
};

export function PostCard({ post }: Props) {
  return (
    <Link href={BlogRoutes.Post(post.slug)}>
      <div className="ease overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
        {post.thumbnailUrl && (
          <Image
            alt={post.title}
            src={post.thumbnailUrl}
            width={500}
            height={400}
            className="h-64 w-full scale-100 object-cover blur-0 grayscale-0 duration-700 ease-in-out"
          />
        )}
        <div className="h-36 border-t border-border px-5 py-8">
          <h3 className="font-cal text-xl tracking-wide">{post.title}</h3>
          <p className="text-md my-2 truncate italic">{post.description}</p>
          <p className="my-2 text-sm text-muted-foreground">
            Published {format(post.createdAt, "MMMM dd, yyyy")}
          </p>
        </div>
      </div>
    </Link>
  );
}
