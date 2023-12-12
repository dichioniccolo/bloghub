import { BarChart3, BookOpen } from "lucide-react";

import { generatePostSlug } from "@acme/lib/utils";
import { cn } from "@acme/ui";
import { Image } from "@acme/ui/components/image";
import { Link } from "@acme/ui/components/link";

interface Props {
  post: {
    id: string;
    slug: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    visits: number;
  };
  expand?: boolean;
}

export function PostCard({ post, expand }: Props) {
  const href = `/${generatePostSlug(post.title, post.id)}`;

  return (
    <div
      className={cn("col-span-1", {
        "md:row-span-2 xl:col-span-2": expand,
      })}
    >
      <Link
        href={href}
        aria-label={`Cover photo of the article titled ${post.title}`}
        className="group mb-4 block w-full overflow-hidden rounded-lg border bg-slate-100 hover:opacity-90 dark:border-slate-800 dark:bg-slate-800"
      >
        <Image
          src={post.thumbnailUrl ?? "/_static/placeholder.png"}
          alt={post.title}
          className="block w-full transition-transform group-hover:scale-110"
        />
      </Link>
      <h2 className="mx-4 mb-3 block text-xl font-extrabold text-slate-900 hover:opacity-75 dark:text-slate-100">
        <Link href={href}>{post.title}</Link>
      </h2>
      <p className="mx-4 mb-3 break-words text-lg leading-snug text-slate-500 hover:opacity-75 dark:text-slate-400">
        <Link href={href}>{post.description}</Link>
      </p>
      <div className="mx-4 flex flex-row flex-wrap items-center">
        <div className="flex flex-col items-start leading-snug">
          <div className="flex flex-row text-sm">
            <Link
              href={href}
              className="flex flex-row items-center text-slate-500 dark:text-slate-400"
            >
              <span className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
              </span>
              <p className="mx-2 font-bold">·</p>
              <span className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>{post.visits} visits</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
