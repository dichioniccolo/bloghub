"use client";

import Link from "next/link";
import { formatDistance } from "date-fns";

import { AppRoutes } from "@acme/common/routes";
import { type Role } from "@acme/db";
import {
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@acme/ui";

import { DeletePostDialog } from "~/app/_components/dialogs/delete-post-dialog";
import { Icons } from "~/app/_components/icons";
import { type GetPosts } from "~/lib/shared/api/posts";
import {
  type GetProject,
  type GetProjectOwner,
} from "~/lib/shared/api/projects";
import { constructPostUrl } from "~/lib/url";
import { cn, formatNumber } from "~/lib/utils";
import { PostCardButton } from "./post-card-button";
import { PostCardCopyButton } from "./post-card-copy-button";
import { QrOptionsDialog } from "./qr-options-dialog";

type Props = {
  post: GetPosts[number];
  project: NonNullable<GetProject>;
  owner: GetProjectOwner;
  currentUserRole: Role;
};

export function PostCard({ post, project, owner, currentUserRole }: Props) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute left-0 top-0 flex h-full w-2 flex-col">
        <div
          className={cn("h-full w-full", {
            "bg-green-500": !post.hidden,
            "bg-amber-500": post.hidden,
          })}
        />
      </div>
      <CardHeader>
        <CardTitle className="text-2xl">{post.title}</CardTitle>
        <CardDescription>
          {project.domainVerified ? (
            <Link
              className="text-blue w-24 truncate text-sm font-semibold dark:text-blue-400 sm:w-full sm:text-base"
              href={constructPostUrl(project.domain, post.slug, {
                withProtocol: true,
              })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="hidden lg:block">
                {constructPostUrl(project.domain, post.slug)}
              </span>
              <span className="lg:hidden">
                {constructPostUrl(project.domain, post.slug, {
                  noDomain: true,
                }).slice(0, 20)}
                ...
              </span>
            </Link>
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <span className="w-24 cursor-not-allowed truncate text-sm font-semibold line-through sm:w-full sm:text-base">
                  <span className="hidden lg:block">
                    {constructPostUrl(project.domain, post.slug)}
                  </span>
                  <span className="lg:hidden">
                    {constructPostUrl(project.domain, post.slug, {
                      noDomain: true,
                    }).slice(0, 20)}
                    ...
                  </span>
                </span>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col gap-4 p-4">
                <span className="text-sm">
                  Your post won&apos;t work until you verify your domain.
                </span>
                <Link
                  href={AppRoutes.ProjectSettings(project.id)}
                  className={cn(buttonVariants())}
                >
                  Verify your domain
                </Link>
              </TooltipContent>
            </Tooltip>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-1">
            <PostCardCopyButton
              url={constructPostUrl(project.domain, post.slug, {
                withProtocol: true,
              })}
            />
            <QrOptionsDialog
              project={project}
              post={post}
              owner={owner}
              trigger={
                <PostCardButton>
                  <span className="sr-only">Download QR</span>
                  <Icons.qr />
                </PostCardButton>
              }
            />
            <Link href={AppRoutes.PostStats(project.id, post.id)}>
              <PostCardButton className="space-x-1">
                <Icons.chart />
                <p className="whitespace-nowrap text-sm">
                  {formatNumber(post._count.visit)}
                  <span className="ml-1 hidden sm:inline-block">clicks</span>
                </p>
              </PostCardButton>
            </Link>
          </div>
          <div className="flex items-center">
            <p className="mr-3 hidden whitespace-nowrap text-sm text-muted-foreground sm:block">
              Added{" "}
              {formatDistance(post.createdAt, new Date(), { addSuffix: true })}
            </p>
            <p className="mr-1 whitespace-nowrap text-sm text-muted-foreground sm:hidden">
              {formatDistance(post.createdAt, new Date(), { addSuffix: false })}
            </p>
            <div className="flex items-center gap-1">
              {(currentUserRole === "OWNER" ||
                currentUserRole === "EDITOR") && (
                <>
                  {owner.usage > owner.quota ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PostCardButton>
                          <p className="sr-only">Edit</p>
                          <Icons.edit />
                        </PostCardButton>
                      </TooltipTrigger>
                      <TooltipContent className="flex flex-col gap-4 p-4">
                        <span className="text-sm">
                          {currentUserRole === "OWNER"
                            ? "You have exceeded your usage limit. We're still collecting data on your existing pots, but you need to upgrade to edit them."
                            : "The owner of this project has exceeded their usage limit. We're still collecting data on all existing posts, but they need to upgrade their plan to edit them."}
                        </span>
                        {currentUserRole === "OWNER" && (
                          <Link
                            href={AppRoutes.Settings}
                            className={cn(buttonVariants())}
                          >
                            Upgrade
                          </Link>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link href={AppRoutes.PostEditor(project.id, post.id)}>
                      <PostCardButton>
                        <Icons.edit />
                        <p className="sr-only">Edit</p>
                      </PostCardButton>
                    </Link>
                  )}
                </>
              )}

              {currentUserRole === "OWNER" && (
                <DeletePostDialog
                  postId={post.id}
                  projectId={project.id}
                  trigger={(loading) => (
                    <PostCardButton variant="destructive">
                      {loading ? (
                        <Icons.spinner className="animate-spin" />
                      ) : (
                        <Icons.delete />
                      )}
                      <p className="sr-only">Delete</p>
                    </PostCardButton>
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
