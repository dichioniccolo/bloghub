import { PlaceholderWithIllustration } from "~/app/_components/placeholder-with-image";
import { getProjects } from "~/lib/shared/api/projects";
import { cn } from "~/lib/utils";
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
        <PlaceholderWithIllustration
          text="You don't have any projects yet!"
          src="/static/illustrations/shopping-call.svg"
        >
          <CreateProjectButton />
        </PlaceholderWithIllustration>
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
