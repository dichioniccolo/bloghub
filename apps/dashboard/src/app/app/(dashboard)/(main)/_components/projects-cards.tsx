import { getProjects } from "~/app/_api/projects";
import { cn } from "~/lib/cn";
import { CreateProjectButton } from "./create-project-button";
import { ProjectCard, ProjectCardSkeleton } from "./project-card";

export async function ProjectsCards() {
  const projects = await getProjects();

  return (
    <div
      className={cn("grid grid-cols-1 gap-5", {
        "lg:grid-cols-3": projects.length > 0,
      })}
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      {projects.length === 0 && (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No projects created</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              You have not created any projects. Add one below.
            </p>
            <CreateProjectButton />
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectsCardsSkeleton() {
  return (
    <div className={cn("grid grid-cols-1 gap-5 lg:grid-cols-3")}>
      {Array.from({ length: 3 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}
