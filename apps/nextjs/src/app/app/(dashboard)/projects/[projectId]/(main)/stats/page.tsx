import Link from "next/link";
import { notFound } from "next/navigation";

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
}

export default async function Page({ params: { projectId } }: Props) {
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

  const analytics = await getProjectAnalytics(projectId);

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
      <Analytics analytics={analytics} />
    </>
  );
}
