import Link from "next/link";
import { format } from "date-fns";

import { type Post } from "@acme/db";
import { BlurImage, HtmlView } from "@acme/ui";

import { summarize, thumbnail } from "~/lib/text";

type Props = {
  post: Pick<Post, "slug" | "title" | "contentHtml" | "createdAt">;
};

export function PostCard({ post }: Props) {
  const { summary } = summarize(post?.contentHtml || "");
  const img = thumbnail(post?.contentHtml || "");

  return (
    <Link href={`/posts/${post.slug}`}>
      <div className="ease overflow-hidden rounded-2xl border-2 border-border bg-card shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
        {img && (
          <BlurImage alt={post.title} src={img} width={1280} height={720} />
        )}
        <div className="h-36 border-t border-border px-5 py-8">
          <h3 className="font-cal text-xl tracking-wide">{post.title}</h3>
          <HtmlView html={summary} className="text-md my-2 truncate italic" />
          <p className="my-2 text-sm text-muted-foreground">
            Published {format(post.createdAt, "MMMM dd, yyyy")}
          </p>
        </div>
      </div>
    </Link>
  );
}
