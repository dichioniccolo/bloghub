import type { Metadata, ServerRuntime } from "next";

import { db, eq, schema } from "@acme/db";
import { Separator } from "@acme/ui/components/ui/separator";

import { getProject } from "~/app/_api/projects";
import { Socials } from "./_components/socials";

interface Props {
  params: {
    projectId: string;
  };
}

export const runtime: ServerRuntime = "edge";

export async function generateMetadata({
  params: { projectId },
}: Props): Promise<Metadata> {
  const project = await getProject(projectId);

  return {
    title: `${project?.name} socials`,
  };
}

export default async function Page({ params: { projectId } }: Props) {
  const socials = await db
    .select()
    .from(schema.projectSocials)
    .where(eq(schema.projectSocials.projectId, projectId));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Socials</h2>
          <p className="text-sm text-muted-foreground">
            Configure your social links.
          </p>
        </div>
      </div>
      <Separator />
      <Socials projectId={projectId} socials={socials} />
    </div>
  );
}
