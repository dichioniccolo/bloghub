import { Card, CardFooter, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import type { GetProject } from "~/app/_api/projects";
import { ChangeName } from "./change-name";
import { CustomDomain } from "./custom-domain";
import { DeleteProject } from "./delete-project";
import { ProjectLogo } from "./project-logo";
import { QuitProject } from "./quit-project";

type Props = {
  project: NonNullable<GetProject>;
};

export function GeneralSettings({ project }: Props) {
  if (project.currentUserRole !== "owner") {
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
