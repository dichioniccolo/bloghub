import { Card, CardFooter, CardHeader } from "@acme/ui/components/card";
import { Skeleton } from "@acme/ui/components/skeleton";

import type { GetProject } from "~/app/_api/projects";
import { getCurrentUserRole } from "~/app/_api/projects";
import { ChangeName } from "./change-name";
import { CustomDomain } from "./custom-domain";
import { DeleteProject } from "./delete-project";
import { ProjectLogo } from "./project-logo";
import { QuitProject } from "./quit-project";

interface Props {
  project: NonNullable<GetProject>;
}

export async function GeneralSettings({ project }: Props) {
  const currentUserRole = await getCurrentUserRole(project.id);

  if (currentUserRole !== "OWNER") {
    return <QuitProject project={project} />;
  }

  return (
    <>
      <ChangeName project={project} />
      <ProjectLogo project={project} />
      <CustomDomain project={project} />
      <DeleteProject project={project} />
    </>
  );
}

export function GeneralSettingsPlaceholder() {
  return new Array(4).map((_, i) => (
    <Card key={i}>
      <CardHeader>
        <div className="text-2xl font-semibold leading-none tracking-tight">
          <Skeleton />
        </div>
        <div className="text-sm text-muted-foreground">
          <Skeleton />
        </div>
      </CardHeader>
      <CardFooter>
        <Skeleton />
      </CardFooter>
    </Card>
  ));
}
