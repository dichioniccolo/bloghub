import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";

import type { GetProject } from "~/app/_api/projects";
import { QuitProjectDialog } from "./quit-project-dialog";

interface Props {
  project: NonNullable<GetProject>;
}

export function QuitProject({ project }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quit Project</CardTitle>
        <CardDescription>
          You can quit this project at any time. You will no longer be able to
          access the project or any of its posts until you get invited back
          again.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <QuitProjectDialog project={project} />
      </CardFooter>
    </Card>
  );
}
