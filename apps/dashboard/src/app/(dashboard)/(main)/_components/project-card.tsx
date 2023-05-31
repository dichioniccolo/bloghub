import Link from "next/link";

import {
  BlurImage,
  Card,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { Routes } from "~/app/routes";
import { type GetProjects } from "~/lib/shared/api/projects";
import { getDefaultAvatarImage } from "~/lib/utils";

type Props = {
  project: GetProjects[number];
};

export function ProjectCard({ project }: Props) {
  return (
    <Link href={Routes.ProjectDashboard(project.id)}>
      <Card className="flex justify-between p-6 transition-all hover:shadow-md">
        <div className="flex items-center space-x-3">
          <BlurImage
            src={project.logo ?? getDefaultAvatarImage(project.name)}
            alt={project.name}
            className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full"
            width={48}
            height={48}
          />
          <div>
            <h2 className="text-lg font-medium text-primary">{project.name}</h2>
            <div className="flex items-center">
              <p className="text-muted-foreground">{project.domain}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {project.domainVerified ? (
            <Icons.check className="h-6 w-6 text-blue-500" />
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <Icons.alertCircle className="h-6 w-6 text-red-500" />
              </TooltipTrigger>
              <TooltipContent>
                The domain associated to this project is not verified
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </Card>
    </Link>
  );
}

export function ProjectCardSkeleton() {
  return <div>loading</div>;
}
