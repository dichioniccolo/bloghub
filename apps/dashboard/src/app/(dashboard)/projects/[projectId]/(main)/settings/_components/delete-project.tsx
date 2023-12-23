import { Button } from "@acme/ui/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/ui/card";

import type { GetProject } from "~/app/_api/projects";
import { DeleteProjectDialog } from "./delete-project-dialog";

interface Props {
  project: NonNullable<GetProject>;
}

export function DeleteProject({ project }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Project</CardTitle>
        <CardDescription>
          Permanently delete your project, custom domain, and all associated
          posts + their stats. This action cannot be undone - please proceed
          with caution.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <DeleteProjectDialog project={project} />
      </CardFooter>
    </Card>
  );
}

export function DeleteProjectPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Project</CardTitle>
        <CardDescription>
          Permanently delete your project, custom domain, and all associated
          posts + their stats. This action cannot be undone - please proceed
          with caution.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button disabled variant="destructive">
          Delete Project
        </Button>
      </CardFooter>
    </Card>
  );
}
