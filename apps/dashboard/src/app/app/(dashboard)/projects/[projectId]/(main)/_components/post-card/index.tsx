"use client";

import type { ElementRef } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";
import { BarChart2, Edit2, MoreVertical, QrCode, Trash2 } from "lucide-react";

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
import { constructPostUrl } from "~/lib/url";
import { formatNumber } from "~/lib/utils";
import { PostCardButton } from "./post-card-button";
import { PostCardCopyButton } from "./post-card-copy-button";
import { QrOptionsDialog } from "./qr-options-dialog";

interface Props {
  post: GetPosts[number];
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
        "relative flex gap-2 rounded-lg border-2 p-3 pr-2 shadow transition-all hover:shadow-md sm:p-4",
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
      <div className="flex h-full w-2 flex-col">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn("h-full w-full rounded-lg", {
                "bg-green-500": !post.hidden,
                "bg-amber-500": post.hidden,
              })}
            />
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-sm">
              {post.hidden
                ? "This post is hidden"
                : "This post is visible to the public"}
            </span>
          </TooltipContent>
        </Tooltip>
      </div>
      <li className="relative flex flex-1 items-center justify-between">
        <div className="relative flex shrink items-center">
          <div>
            <div className="flex max-w-fit items-center space-x-2">
              <Link
                onClick={(e) => e.stopPropagation()}
                href={AppRoutes.PostEditor(project.id, post.id)}
                className="w-full max-w-[170px] truncate text-sm font-semibold text-accent-foreground sm:max-w-[300px] sm:text-base md:max-w-[360px] xl:max-w-[500px]"
              >
                {post.title || "Untitled post"}
              </Link>
              <PostCardCopyButton url={postUrl} />
            </div>
            <div className="flex max-w-fit items-center space-x-1">
              <p className="whitespace-nowrap text-sm text-muted-foreground">
                {formatDistance(post.createdAt, new Date(), {
                  addSuffix: true,
                })}
              </p>
              <p>•</p>
              {project.domainVerified ? (
                <Link
                  onClick={(e) => e.stopPropagation()}
                  href={postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="max-w-[180px] truncate text-sm font-medium underline-offset-2 hover:underline sm:max-w-[300px] md:max-w-[360px] xl:max-w-[500px]"
                >
                  {postUrl}
                </Link>
              ) : (
                <Tooltip>
                  <TooltipTrigger>
                    <p className="max-w-[180px] truncate text-sm font-medium underline-offset-2 hover:underline sm:max-w-[300px] md:max-w-[360px] xl:max-w-[500px]">
                      {postUrl}
                    </p>
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
          <Link href={AppRoutes.PostStats(project.id, post.id)}>
            <PostCardButton className="space-x-1 rounded-md px-2 py-0.5">
              <BarChart2 className="h-4 w-4" />
              <p className="whitespace-nowrap text-sm text-muted-foreground">
                {formatNumber(post.visitsCount)}
                <span className="ml-1 hidden sm:inline-block">visits</span>
              </p>
            </PostCardButton>
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
                className="text-destructive hover:text-destructive"
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
