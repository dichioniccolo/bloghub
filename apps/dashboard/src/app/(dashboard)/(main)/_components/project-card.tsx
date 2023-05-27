import Link from "next/link";

import {
  BlurImage,
  Card,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { type GetProjects } from "~/lib/shared/api/projects";

type Props = {
  project: GetProjects[number];
};

export function ProjectCard({ project }: Props) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="flex justify-between p-6 transition-all hover:shadow-md">
        <div className="flex items-center space-x-3">
          <BlurImage
            src={
              project.logo ??
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAIhJREFUaEPt0sEJACEQBEHNP7XNSYOohwh9/1mw6/bMnPXxt3vAY70EHgOsBBLAAv1CGJDnCXBCPJAABuR5ApwQDySAAXmeACfEAwlgQJ4nwAnxQAIYkOcJcEI8kAAG5HkCnBAPJIABeZ4AJ8QDCWBAnifACfFAAhiQ5wlwQjyQAAbkeQKcEA9cSuOiwSGdZ9oAAAAASUVORK5CYII="
            }
            alt={project.name}
            className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full"
            width={48}
            height={48}
          />
          <div>
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {project.name}
            </h2>
            <div className="flex items-center">
              <p className="text-gray-500">{project.domain}</p>
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
