import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import { BlurImage, HtmlView } from "@acme/ui";

import { getPostBySlug } from "~/app/actions/posts";
import { summarize } from "~/lib/text";

type Props = {
  params: {
    domain: string;
    slug: string;
  };
};

export async function generateMetadata({
  params: { domain, slug },
}: Props): Promise<Metadata> {
  const post = await getPostBySlug(domain, slug);

  const { summary } = summarize(post?.contentHtml || "");

  return {
    title: post?.title,
    description: summary,
  };
}

export default async function Page({ params: { domain, slug } }: Props) {
  const post = await getPostBySlug(domain, slug);

  if (!post) {
    return notFound();
  }

  const { summary } = summarize(post?.contentHtml || "");

  return (
    <div>
      <div className="ease fixed left-0 right-0 top-0 z-30 flex h-16 w-full bg-background transition-all duration-150">
        <div className="mx-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 px-10 sm:px-20">
          <Link
            href="/"
            className="flex items-center justify-center"
            aria-label={post.project.name}
          >
            {post.project.logo && (
              <span className="inline-block h-8 w-8 overflow-hidden rounded-full align-middle">
                <BlurImage
                  height={40}
                  width={40}
                  src={post.project.logo}
                  alt={post.project.name}
                />
              </span>
            )}
            <span className="ml-3 inline-block truncate font-medium">
              {post.project.name}
            </span>
          </Link>
        </div>
      </div>
      <div className="my-20">
        <div className="flex flex-col items-center justify-center">
          <div className="m-auto w-full text-center md:w-7/12">
            <p className="m-auto my-5 w-10/12 text-sm font-light text-muted-foreground md:text-base">
              {format(post.createdAt, "MMMM dd, yyyy")}
            </p>
            <h1 className="font-cal mb-10 text-3xl font-bold text-primary md:text-6xl">
              {post.title}
            </h1>
            <HtmlView
              html={summary}
              className="text-md m-auto w-10/12 text-secondary-foreground md:text-lg"
            />
          </div>
          {/** add who created this post */}
        </div>
      </div>
      <HtmlView
        html={post.contentHtml}
        className="m-auto w-11/12 sm:w-3/4"
        as="article"
      />
      <div className="relative mb-20 mt-10 sm:mt-20">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-sm">Continue Reading</span>
        </div>
      </div>
    </div>
    // <article>
    //   <div className="pb-12">
    //     <div className="flex items-center justify-between gap-4">
    //       <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">
    //         {post.title}
    //       </h1>
    //     </div>
    //     <div className="mt-6">
    //       <time dateTime={formatISO(post.createdAt)}>
    //         {formatDistance(post.createdAt, new Date(), { addSuffix: true })}
    //       </time>
    //     </div>
    //     <HtmlView html={post.contentHtml} className="mt-8" />
    //     <div className="clear-both mt-6 flex gap-4">
    //       {/* <LikeButton
    //         likedBy={post.likedBy}
    //         onLike={() => {
    //           likeMutation.mutate(post.id);
    //         }}
    //         onUnlike={() => {
    //           unlikeMutation.mutate(post.id);
    //         }}
    //       /> */}
    //       {/* <ButtonLink
    //         href={`/post/${post.id}#comments`}
    //         variant="secondary"
    //       >
    //         <MessageIcon className="h-4 w-4 text-secondary" />
    //         <span className="ml-1.5">{postQuery.data.comments.length}</span>
    //       </ButtonLink> */}
    //     </div>
    //   </div>

    //   <div id="comments" className="space-y-12 pt-12">
    //     {/* {post.comments.length > 0 && (
    //       <ul className="space-y-12">
    //         {post.comments.map((comment) => (
    //           <li key={comment.id}>
    //             <Comment postId={post.id} comment={comment} />
    //           </li>
    //         ))}
    //       </ul>
    //     )} */}
    //     {/* <div className="flex items-start gap-2 sm:gap-4">
    //       <span className="hidden sm:inline-block">
    //         <Avatar name={session!.user.name} src={session!.user.image} />
    //       </span>
    //       <span className="inline-block sm:hidden">
    //         <Avatar
    //           name={session!.user.name}
    //           src={session!.user.image}
    //           size="sm"
    //         />
    //       </span>
    //       <AddCommentForm postId={postQuery.data.id} />
    //     </div> */}
    //   </div>
    // </article>
  );
}
