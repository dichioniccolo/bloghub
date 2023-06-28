import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Check } from "lucide-react";

import { Card } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { GetProjects } from "~/app/_api/projects";
import { AppRoutes } from "~/lib/common/routes";
import { getDefaultAvatarImage } from "~/lib/utils";

type Props = {
  project: GetProjects[number];
};

export function ProjectCard({ project }: Props) {
  return (
    <Link href={AppRoutes.ProjectDashboard(project.id)}>
      <Card className="flex justify-between p-6 transition-all hover:shadow-md">
        <div className="flex items-center space-x-3">
          <Image
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
            <Check className="h-6 w-6 text-blue-500" />
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <AlertCircle className="h-6 w-6 text-red-500" />
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
