import { Button } from "@acme/ui/components/ui/button";
import { Card, CardFooter, CardHeader } from "@acme/ui/components/ui/card";
import { Skeleton } from "@acme/ui/components/ui/skeleton";

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
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="w-20">
              <h2 className="text-2xl font-semibold leading-none tracking-tight">
                &nbsp;
              </h2>
            </Skeleton>
            <Skeleton className="w-60">
              <p className="text-sm text-muted-foreground">&nbsp;</p>
            </Skeleton>
          </CardHeader>
          <CardFooter>
            <Skeleton>
              <Button
                className="w-20"
                variant={i === 3 ? "destructive" : "default"}
                disabled
              >
                &nbsp;
              </Button>
            </Skeleton>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
