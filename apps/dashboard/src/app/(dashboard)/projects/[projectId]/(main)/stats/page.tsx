import type { ServerRuntime } from "next";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { AnalyticsInterval } from "@acme/lib/utils";

import {
  getProject,
  getProjectAnalytics,
  getProjectOwner,
} from "~/app/_api/projects";
import { Analytics } from "./_components/analytics";

interface Props {
  params: {
    projectId: string;
  };
  searchParams: {
    interval?: AnalyticsInterval;
    country?: string;
    city?: string;
    slug?: string;
    referer?: string;
    device?: string;
    browser?: string;
    os?: string;
  };
}

export const runtime: ServerRuntime = "edge";

export default async function Page({
  params: { projectId },
  searchParams,
}: Props) {
  unstable_noStore();
  const project = await getProject(projectId);

  if (!project) {
    return notFound();
  }

  const owner = await getProjectOwner(projectId);

  if (owner.usage > owner.quota) {
    return (
      <>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold">Analytics for {project.name}</h1>
            <Link
              href={`https://${project.domain}`}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-stone truncate rounded-md px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
            >
              {project.domain} ↗
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          You have exceeded your monthly visits. You won&apos; have access to
          statistics until you upgrade or wait for the next billing month
        </div>
      </>
    );
  }

  const filters = {
    interval: searchParams?.interval ?? "month",
    country: searchParams?.country ?? null,
    city: searchParams?.city ?? null,
    slug: searchParams?.slug ?? null,
    referer: searchParams?.referer ?? null,
    device: searchParams?.device ?? null,
    browser: searchParams?.browser ?? null,
    os: searchParams?.os ?? null,
  };

  const analytics = await getProjectAnalytics(projectId, filters);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">Analytics for {project.name}</h1>
          <Link
            href={`https://${project.domain}`}
            target="_blank"
            rel="noreferrer noopener"
            className="bg-stone truncate rounded-md px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
          >
            {project.domain} ↗
          </Link>
        </div>
      </div>
      <Analytics filters={filters} analytics={analytics} />
    </>
  );
}
