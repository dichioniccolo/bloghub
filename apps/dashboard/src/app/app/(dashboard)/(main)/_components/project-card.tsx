import Image from "next/image";
import Link from "next/link";
import { AlertCircle, BarChart2, CaseSensitive } from "lucide-react";

import { Skeleton } from "@acme/ui/components/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@acme/ui/components/tooltip";
import { CheckCircleFill } from "@acme/ui/icons/check-circle-fill";

import type { GetProjects } from "~/app/_api/projects";
import { GOOGLE_FAVICON_URL } from "~/lib/constants";
import { AppRoutes } from "~/lib/routes";
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
            <div className="text-lg font-medium">
              <Skeleton className="ml-1 h-5 w-32" />
            </div>
            <div className="flex items-center">
              <div className="text-muted-foreground">
                <Skeleton className="ml-1 h-5 w-40" />
              </div>
              <Skeleton className="ml-1 h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CaseSensitive className="h-4 w-4" />
          <div className="whitespace-nowrap text-sm">
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <BarChart2 className="h-4 w-4" />
          <div className="whitespace-nowrap text-sm">
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
