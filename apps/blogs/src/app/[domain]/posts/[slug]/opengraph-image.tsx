/* eslint-disable react/no-unknown-property */
import type { ServerRuntime } from "next";
import { ImageResponse } from "next/og";

import { db } from "@acme/db";
import { truncate } from "@acme/lib/utils";

export const runtime: ServerRuntime = "edge";

interface Props {
  params: {
    domain: string;
    slug: string;
  };
}

export default async function PostOG({ params: { domain, slug } }: Props) {
  const post = await db.post.findFirst({
    where: {
      project: {
        deletedAt: null,
        domain,
      },
      slug,
    },
    select: {
      title: true,
      description: true,
      thumbnailUrl: true,
      project: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div tw="flex flex-col items-center w-full h-full bg-white">
        <div tw="flex flex-col items-center justify-center mt-8">
          <h1 tw="text-6xl font-bold text-stone-900 leading-none tracking-tight">
            {post.title}
          </h1>
          {post.description && (
            <p tw="mt-4 text-xl text-stone-600 max-w-xl text-center">
              {truncate(post.description, 120)}
            </p>
          )}
          <div tw="flex items-center justify-center">
            {post.project.logo && (
              <img
                tw="w-12 h-12 rounded-full mr-4"
                src={post.project.logo}
                alt={post.project.name}
              />
            )}
            <p tw="text-xl font-medium text-stone-900">
              by {post.project.name}
            </p>
          </div>
          {post.thumbnailUrl && (
            <img
              tw="mt-4 w-5/6 rounded-2xl border border-stone-200 shadow-md"
              src={post.thumbnailUrl}
              alt={post.title}
            />
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      emoji: "blobmoji",
    },
  );
}
