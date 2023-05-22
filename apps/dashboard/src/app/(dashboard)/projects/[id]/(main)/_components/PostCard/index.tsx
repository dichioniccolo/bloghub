"use client";

import Link from "next/link";

import { type Role } from "@acme/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  buttonVariants,
} from "@acme/ui";

import { DeletePostDialog } from "~/app/_components/dialogs/delete-post-dialog";
import { Icons } from "~/app/_components/icons";
import { type GetPosts } from "~/lib/shared/api/posts";
import {
  type GetProject,
  type GetProjectOwner,
} from "~/lib/shared/api/projects";
import { constructPostUrl } from "~/lib/url";
import { cn, formatNumber, timeAgo } from "~/lib/utils";
import { PostCardButton } from "./post-card-button";
import { PostCardCopyButton } from "./post-card-copy-button";
import { PostCardTogglePublishedButton } from "./post-card-toggle-published-button.tsx";
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
            "bg-green-500": post.published,
            "bg-amber-500": !post.published,
          })}
        />
      </div>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
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
                <span className="w-24 cursor-not-allowed truncate text-sm font-semibold text-gray-400 line-through sm:w-full sm:text-base">
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
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Your post won&apos;t work until you verify your domain.
                </span>
                <Link
                  href={`/projects/${project.id}/settings`}
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
                  <Icons.qr className="text-gray-700 transition-colors group-hover:text-blue-800 dark:text-gray-100 dark:group-hover:text-blue-300" />
                </PostCardButton>
              }
            />
            <Link
              href={{
                pathname: `/${project.id}/post/${post.id}/stats`,
              }}
              className="flex items-center space-x-1 rounded-md bg-gray-100 px-2 py-0.5 transition-all duration-75 hover:scale-105 active:scale-100 dark:bg-gray-700"
            >
              <Icons.chart className="text-gray-700 transition-colors group-hover:text-blue-800 dark:text-gray-100 dark:group-hover:text-blue-300" />
              <p className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {formatNumber(post.clicks)}
                <span className="ml-1 hidden sm:inline-block">clicks</span>
              </p>
            </Link>
          </div>
          <div className="flex items-center">
            <p className="mr-3 hidden whitespace-nowrap text-sm text-gray-500 sm:block">
              Added {timeAgo(post.createdAt)}
            </p>
            <p className="mr-1 whitespace-nowrap text-sm text-gray-500 sm:hidden">
              {timeAgo(post.createdAt, true)}
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
                          <Icons.edit className="h-4 w-4" />
                        </PostCardButton>
                      </TooltipTrigger>
                      <TooltipContent className="flex flex-col gap-4 p-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {currentUserRole === "OWNER"
                            ? "You have exceeded your usage limit. We're still collecting data on your existing pots, but you need to upgrade to edit them."
                            : "The owner of this project has exceeded their usage limit. We're still collecting data on all existing posts, but they need to upgrade their plan to edit them."}
                        </span>
                        {currentUserRole === "OWNER" && (
                          <Link
                            href="/settings"
                            className={cn(buttonVariants())}
                          >
                            Upgrade
                          </Link>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <>
                      <Link href={`/projects/${project.id}/post/${post.id}`}>
                        <PostCardButton>
                          <Icons.edit className="text-gray-700 transition-colors group-hover:text-blue-800 dark:text-gray-100 dark:group-hover:text-blue-300" />
                          <p className="sr-only">Edit</p>
                        </PostCardButton>
                      </Link>
                    </>
                  )}
                </>
              )}

              {currentUserRole === "OWNER" && (
                <DeletePostDialog
                  id={post.id}
                  projectId={project.id}
                  trigger={(loading) => (
                    <PostCardButton>
                      {loading ? (
                        <Icons.spinner className="animate-spin text-gray-700 transition-colors dark:text-gray-100" />
                      ) : (
                        <Icons.delete className="text-red-700 transition-colors group-hover:text-blue-800 dark:text-red-100 dark:group-hover:text-blue-300" />
                      )}
                      <p className="sr-only">Delete</p>
                    </PostCardButton>
                  )}
                />
              )}

              {(currentUserRole === "OWNER" ||
                currentUserRole === "EDITOR") && (
                <PostCardTogglePublishedButton project={project} post={post} />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
