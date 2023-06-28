"use client";

import Link from "next/link";
import { formatDistance } from "date-fns";
import { BarChart, Edit, Loader2, QrCode, Trash2 } from "lucide-react";

import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { GetPosts } from "~/app/_api/posts";
import type { GetProject, GetProjectOwner } from "~/app/_api/projects";
import { DeletePostDialog } from "~/app/_components/dialogs/delete-post-dialog";
import { cn } from "~/lib/cn";
import { AppRoutes } from "~/lib/common/routes";
import { constructPostUrl } from "~/lib/url";
import { formatNumber } from "~/lib/utils";
import { PostCardButton } from "./post-card-button";
import { PostCardCopyButton } from "./post-card-copy-button";
import { QrOptionsDialog } from "./qr-options-dialog";

type Props = {
  post: GetPosts[number];
  project: NonNullable<GetProject>;
  owner: GetProjectOwner;
};

export function PostCard({ post, project, owner }: Props) {
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
              className={cn(
                "text-blue w-24 truncate text-sm font-semibold dark:text-blue-400 sm:w-full sm:text-base",
                {
                  "cursor-not-allowed": post.hidden,
                },
              )}
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
              <TooltipContent className="flex max-w-xs flex-col gap-4 p-4">
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
                  <QrCode />
                </PostCardButton>
              }
            />
            {owner.usage > owner.quota ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <PostCardButton className="space-x-1">
                    <BarChart />
                    <p className="whitespace-nowrap text-sm">
                      {formatNumber(post.visitsCount)}
                      <span className="ml-1 hidden sm:inline-block">
                        clicks
                      </span>
                    </p>
                  </PostCardButton>
                </TooltipTrigger>
                <TooltipContent className="flex max-w-xs flex-col gap-4 p-4">
                  <span className="text-sm">
                    {project.currentUserRole === "owner"
                      ? "You have exceeded your usage limit. We're still collecting data on your existing posts, but you need to upgrade to view the stats them."
                      : "The owner of this project has exceeded their usage limit. We're still collecting data on all existing posts, but they need to upgrade their plan to view the stats on them."}
                  </span>
                  {project.currentUserRole === "owner" && (
                    <Link
                      href={AppRoutes.BillingSettings}
                      className={buttonVariants()}
                    >
                      Upgrade
                    </Link>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link href={AppRoutes.PostStats(project.id, post.id)}>
                <PostCardButton className="space-x-1">
                  <BarChart />
                  <p className="whitespace-nowrap text-sm">
                    {formatNumber(post.visitsCount)}
                    <span className="ml-1 hidden sm:inline-block">clicks</span>
                  </p>
                </PostCardButton>
              </Link>
            )}
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
              <Link href={AppRoutes.PostEditor(project.id, post.id)}>
                <PostCardButton>
                  <Edit />
                  <p className="sr-only">Edit</p>
                </PostCardButton>
              </Link>

              <DeletePostDialog
                postId={post.id}
                projectId={project.id}
                trigger={(loading) => (
                  <PostCardButton variant="destructive">
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 />
                    )}
                    <p className="sr-only">Delete</p>
                  </PostCardButton>
                )}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
