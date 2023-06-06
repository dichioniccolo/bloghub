import { type GetProject } from "~/lib/shared/api/projects";
import { CustomDomain, CustomDomainPlaceholder } from "./custom-domain";
import { DeleteProject, DeleteProjectPlaceholder } from "./delete-project";
import { QuitProject, QuitProjectPlaceholder } from "./quit-project";

type Props = {
  project: NonNullable<GetProject>;
};

export function GeneralSettings({ project }: Props) {
  if (project.currentUserRole !== "owner") {
    return <QuitProject project={project} />;
  }

  return (
    <>
      <CustomDomain project={project} />
      <DeleteProject project={project} />
    </>
  );
}

export function GeneralSettingsPlaceholder() {
  return (
    <>
      <QuitProjectPlaceholder />
      <CustomDomainPlaceholder />
      <DeleteProjectPlaceholder />
    </>
  );
}
