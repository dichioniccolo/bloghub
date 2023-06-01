import { notFound } from "next/navigation";
import { formatDistance, formatISO } from "date-fns";

import { HtmlView } from "@acme/ui";

import { getPostBySlug } from "~/app/actions/posts";

type Props = {
  params: {
    domain: string;
    slug: string;
  };
};

export default async function Page({ params: { domain, slug } }: Props) {
  const post = await getPostBySlug(domain, slug);

  if (!post) {
    return notFound();
  }

  return (
    <article className="divide-y divide-primary">
      <div className="pb-12">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">
            {post.title}
          </h1>
        </div>
        <div className="mt-6">
          <time dateTime={formatISO(post.createdAt)}>
            {formatDistance(post.createdAt, new Date(), { addSuffix: true })}
          </time>
        </div>
        <HtmlView html={post.contentHtml} className="mt-8" />
        <div className="clear-both mt-6 flex gap-4">
          {/* <LikeButton
            likedBy={post.likedBy}
            onLike={() => {
              likeMutation.mutate(post.id);
            }}
            onUnlike={() => {
              unlikeMutation.mutate(post.id);
            }}
          /> */}
          {/* <ButtonLink
            href={`/post/${post.id}#comments`}
            variant="secondary"
          >
            <MessageIcon className="h-4 w-4 text-secondary" />
            <span className="ml-1.5">{postQuery.data.comments.length}</span>
          </ButtonLink> */}
        </div>
      </div>

      <div id="comments" className="space-y-12 pt-12">
        {/* {post.comments.length > 0 && (
          <ul className="space-y-12">
            {post.comments.map((comment) => (
              <li key={comment.id}>
                <Comment postId={post.id} comment={comment} />
              </li>
            ))}
          </ul>
        )} */}
        {/* <div className="flex items-start gap-2 sm:gap-4">
          <span className="hidden sm:inline-block">
            <Avatar name={session!.user.name} src={session!.user.image} />
          </span>
          <span className="inline-block sm:hidden">
            <Avatar
              name={session!.user.name}
              src={session!.user.image}
              size="sm"
            />
          </span>
          <AddCommentForm postId={postQuery.data.id} />
        </div> */}
      </div>
    </article>
  );
}
