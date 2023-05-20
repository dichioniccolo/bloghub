import { Suspense } from "react";
import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { getProject } from "~/lib/shared/api/projects";
import {
  GeneralSettings,
  GeneralSettingsPlaceholder,
} from "./_components/general-settings";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  const projectById = await getProject(id);

  return {
    title: `${projectById?.name} settings`,
  };
}

export default async function Page({ params: { id } }: Props) {
  const project = await getProject(id);

  if (!project) return notFound();

  return (
    <Suspense fallback={<GeneralSettingsPlaceholder />}>
      {/* @ts-expect-error react async component */}
      <GeneralSettings project={project} />
    </Suspense>
  );
}
