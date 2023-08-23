/* eslint-disable react/no-unknown-property */
import type { ServerRuntime } from "next";
import { ImageResponse } from "next/server";

import { and, db, eq, posts, projects } from "@acme/db";

import { truncate } from "~/lib/utils";

export const runtime: ServerRuntime = "edge";

interface Props {
  params: {
    domain: string;
    slug: string;
  };
}

export default async function PostOG({ params: { domain, slug } }: Props) {
  const post = await db
    .select({
      title: posts.title,
      description: posts.description,
      thumbnailUrl: posts.thumbnailUrl,
      project: {
        name: projects.name,
        logo: projects.logo,
      },
    })
    .from(posts)
    .innerJoin(projects, eq(posts.projectId, projects.id))
    .where(and(eq(posts.slug, slug), eq(projects.domain, domain)))
    .then((x) => x[0]);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const clashData = await fetch(
    new URL("~/styles/CalSans-SemiBold.otf", import.meta.url),
  ).then((res) => res.arrayBuffer());

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
      fonts: [
        {
          name: "Clash",
          data: clashData,
        },
      ],
      emoji: "blobmoji",
    },
  );
}
