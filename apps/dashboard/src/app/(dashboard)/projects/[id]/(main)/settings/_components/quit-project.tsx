import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui";

import { type GetProject } from "~/lib/shared/api/projects";
import { QuitProjectDialog } from "./quit-project-dialog";

type Props = {
  project: NonNullable<GetProject>;
};

export function QuitProject({ project }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quit Project</CardTitle>
        <CardDescription>
          Permanently delete your project, custom domain, and all associated
          posts + their stats. This action cannot be undone - please proceed
          with caution.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <QuitProjectDialog project={project} />
      </CardFooter>
    </Card>
  );
}

export function QuitProjectPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quit Project</CardTitle>
        <CardDescription>
          Permanently delete your project, custom domain, and all associated
          posts + their stats. This action cannot be undone - please proceed
          with caution.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button disabled variant="destructive">
          Quit Project
        </Button>
      </CardFooter>
    </Card>
  );
}
