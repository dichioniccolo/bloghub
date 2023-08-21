import Image from "next/image";
import Link from "next/link";
import { AlertCircle, BarChart2, CaseSensitive } from "lucide-react";

import type { GetProjects } from "~/app/_api/projects";
import { CheckCircleFill } from "~/components/icons/check-circle-fill";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { AppRoutes } from "~/lib/common/routes";
import { GOOGLE_FAVICON_URL } from "~/lib/constants";
import { formatNumber } from "~/lib/utils";

interface Props {
  project: GetProjects[number];
}

export function ProjectCard({ project }: Props) {
  return (
    <Link
      href={AppRoutes.ProjectDashboard(project.id)}
      className="flex flex-col gap-10 rounded-lg border border-border p-6 shadow transition-all hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src={project.logo ?? `${GOOGLE_FAVICON_URL}${project.domain}`}
            alt={project.name}
            className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full"
            width={48}
            height={48}
          />
          <div>
            <h2 className="text-lg font-medium">{project.name}</h2>
            <div className="flex items-center">
              <p className="text-muted-foreground">{project.domain}</p>
              <Tooltip>
                <TooltipTrigger className="ml-1 flex items-center">
                  {project.domainVerified ? (
                    <CheckCircleFill className="h-5 w-5 text-blue-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  The domain associated to this project is{" "}
                  {project.domainVerified ? "verified" : "not verified"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CaseSensitive className="h-4 w-4" />
          <h3 className="whitespace-nowrap text-sm">
            {formatNumber(project.postsCount)} post
            {project.postsCount !== 1 && "s"}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <BarChart2 className="h-4 w-4" />
          <h3 className="whitespace-nowrap text-sm">
            {formatNumber(project.visitsCount)} visit
            {project.visitsCount !== 1 && "s"}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col gap-10 rounded-lg border border-border p-6 shadow transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full" />
          <div>
            <h2 className="text-lg font-medium">
              <Skeleton className="ml-1 h-5 w-32" />
            </h2>
            <div className="flex items-center">
              <p className="text-muted-foreground">
                <Skeleton className="ml-1 h-5 w-40" />
              </p>
              <Skeleton className="ml-1 h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CaseSensitive className="h-4 w-4" />
          <h3 className="whitespace-nowrap text-sm">
            <Skeleton className="h-4 w-20" />
          </h3>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <BarChart2 className="h-4 w-4" />
          <h3 className="whitespace-nowrap text-sm">
            <Skeleton className="h-4 w-20" />
          </h3>
        </div>
      </div>
    </div>
  );
}
