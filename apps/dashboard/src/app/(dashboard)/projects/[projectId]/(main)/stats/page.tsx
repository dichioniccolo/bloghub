import { notFound, redirect } from "next/navigation";

import { auth } from "@acme/auth";
import { AppRoutes } from "@acme/lib/routes";
import type { AnalyticsInterval } from "@acme/lib/utils";
import { PRO_INTERVALS } from "@acme/lib/utils";

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

// export const runtime: ServerRuntime = "edge";

export default async function Page({
  params: { projectId },
  searchParams,
}: Props) {
  const session = await auth();

  if (!session) {
    return redirect(AppRoutes.Login);
  }

  const project = await getProject(projectId);

  if (!project) {
    return notFound();
  }

  const owner = await getProjectOwner(projectId);

  if (owner.usage > owner.quota) {
    return (
      <>
        <div className="flex items-center justify-center">
          You have exceeded your monthly visits. You won&apos; have access to
          statistics until you upgrade or wait for the next billing month
        </div>
      </>
    );
  }

  const filters = {
    interval: searchParams?.interval ?? "30d",
    country: searchParams?.country ?? null,
    city: searchParams?.city ?? null,
    slug: searchParams?.slug ?? null,
    referer: searchParams?.referer ?? null,
    device: searchParams?.device ?? null,
    browser: searchParams?.browser ?? null,
    os: searchParams?.os ?? null,
  };

  if (
    !owner.isPro &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    PRO_INTERVALS.map((x) => x.value).includes(filters.interval as any)
  ) {
    filters.interval = "30d";
  }

  const analytics = await getProjectAnalytics(projectId, filters);

  return (
    <Analytics
      session={session}
      owner={owner}
      filters={filters}
      analytics={analytics}
    />
  );
}
