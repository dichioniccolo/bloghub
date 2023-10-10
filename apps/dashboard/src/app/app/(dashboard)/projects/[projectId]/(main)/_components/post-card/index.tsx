"use client";

import type { ElementRef } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";
import { BarChart2, Edit2, MoreVertical, QrCode, Trash2 } from "lucide-react";

import { constructPostUrl } from "@acme/lib/url";
import { formatNumber } from "@acme/lib/utils";
import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@acme/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@acme/ui/components/tooltip";

import type { GetPosts } from "~/app/_api/posts";
import type { GetProject, GetProjectOwner } from "~/app/_api/projects";
import { DeletePostDialog } from "~/components/dialogs/delete-post-dialog";
import { AppRoutes } from "~/lib/routes";
import { PostCardButton } from "./post-card-button";
import { PostCardCopyButton } from "./post-card-copy-button";
import { QrOptionsDialog } from "./qr-options-dialog";

interface Props {
  post: GetPosts["data"][number];
  project: NonNullable<GetProject>;
  owner: GetProjectOwner;
}

export function PostCard({ post, project, owner }: Props) {
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);

  const postRef = useRef<ElementRef<"div">>(null);

  const [selected, setSelected] = useState(false);

  const handleClickOnCard = useCallback((e: MouseEvent) => {
    if (postRef.current && !postRef.current.contains(e.target as Node)) {
      setSelected(false);
    } else {
      setSelected((v) => !v);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOnCard);
    return () => {
      document.removeEventListener("click", handleClickOnCard);
    };
  }, [handleClickOnCard]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selected) {
        return;
      }

      if (!["e", "q", "x", "s"].includes(e.key)) {
        return;
      }

      setSelected(false);
      e.preventDefault();

      if (e.key === "e") {
        router.push(AppRoutes.PostEditor(project.id, post.id));
      } else if (e.key === "q") {
        setQrCodeOpen(true);
      } else if (e.key === "x") {
        setDeleteOpen(true);
      } else if (e.key === "s") {
        router.push(AppRoutes.PostStats(project.id, post.id));
      }
    },
    [selected, project, post, router],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  const postUrl = constructPostUrl(project.domain, post.slug);

  return (
    <div
      ref={postRef}
      className={cn(
        "relative rounded-lg border-2 border-border bg-white p-3 pr-1 shadow transition-all hover:shadow-md sm:p-4",
        {
          "border-black dark:border-zinc-400": selected,
          "border-border": !selected,
        },
      )}
    >
      {qrCodeOpen && (
        <QrOptionsDialog
          open={qrCodeOpen}
          onOpenChange={setQrCodeOpen}
          project={project}
          post={post}
          owner={owner}
        />
      )}
      {deleteOpen && (
        <DeletePostDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          projectId={project.id}
          postId={post.id}
        />
      )}
      <li className="relative flex items-center justify-between">
        <div className="relative flex shrink items-center">
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn("h-8 w-2 rounded-lg blur-0 sm:h-10", {
                  "bg-green-500": !post.hidden,
                  "bg-amber-500": post.hidden,
                })}
              />
            </TooltipTrigger>
            <TooltipContent className="text-sm">
              {post.hidden
                ? "This post is hidden"
                : "This post is visible to the public"}
            </TooltipContent>
          </Tooltip>
          <div className="ml-2 sm:ml-4">
            <div className="flex max-w-fit items-center space-x-2">
              <p className="w-full max-w-[140px] truncate text-sm font-semibold sm:max-w-[300px] sm:text-base md:max-w-[360px] xl:max-w-[500px]">
                {post.title || "Untitled post"}
              </p>
              <PostCardCopyButton url={postUrl} />
            </div>
            <div className="flex max-w-fit items-center space-x-1">
              <p className="whitespace-nowrap text-sm text-gray-500">
                {formatDistance(post.createdAt, new Date(), {
                  addSuffix: true,
                })}
              </p>
              <p className="hidden sm:block">•</p>
              {project.domainVerified ? (
                <Link
                  onClick={(e) => e.stopPropagation()}
                  href={postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden max-w-[140px] truncate text-sm font-medium text-gray-700 underline-offset-2 hover:underline sm:block sm:max-w-[300px] md:max-w-[360px] xl:max-w-[440px]"
                >
                  {postUrl}
                </Link>
              ) : (
                <Tooltip>
                  <TooltipTrigger className="hidden max-w-[140px] truncate text-sm font-medium text-gray-700 underline-offset-2 hover:underline sm:block sm:max-w-[300px] md:max-w-[360px] xl:max-w-[440px]">
                    {postUrl}
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
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={AppRoutes.PostStats(project.id, post.id)}
            className="hidden items-center space-x-1 rounded-md bg-gray-100 px-2 py-0.5 transition-all duration-75 hover:scale-105 active:scale-100 md:inline-flex"
          >
            <BarChart2 className="h-4 w-4" />
            <p className="whitespace-nowrap text-sm text-muted-foreground">
              {formatNumber(post.visitsCount)}
              <span className="ml-1 hidden sm:inline-block">visits</span>
            </p>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <PostCardButton className="rounded-md px-1 py-2">
                <span className="sr-only">Menu</span>
                <MoreVertical className="h-5 w-5" />
              </PostCardButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={AppRoutes.PostEditor(project.id, post.id)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                  <DropdownMenuShortcut>E</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setQrCodeOpen(true)}>
                <QrCode className="mr-2 h-4 w-4" />
                QR Code
                <DropdownMenuShortcut>Q</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setDeleteOpen(true)}
                className="text-destructive hover:bg-destructive hover:text-foreground"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
                <DropdownMenuShortcut className="dark:opacity-100">
                  X
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </li>
    </div>
  );
}
