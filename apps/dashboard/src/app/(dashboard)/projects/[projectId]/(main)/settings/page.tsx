import { Suspense } from "react";
import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { Separator } from "@acme/ui/components/separator";

import { getProject } from "~/app/_api/projects";
import {
  GeneralSettings,
  GeneralSettingsPlaceholder,
} from "./_components/general-settings";

type Props = {
  params: {
    projectId: string;
  };
};

export async function generateMetadata({
  params: { projectId },
}: Props): Promise<Metadata> {
  const projectById = await getProject(projectId);

  return {
    title: `${projectById?.name} settings`,
  };
}

export default async function Page({ params: { projectId } }: Props) {
  const project = await getProject(projectId);

  if (!project) return notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">General</h2>
        <p className="text-sm text-muted-foreground">
          Configure your project settings.
        </p>
      </div>
      <Separator />
      <Suspense fallback={<GeneralSettingsPlaceholder />}>
        <GeneralSettings project={project} />
      </Suspense>
    </div>
  );
}
