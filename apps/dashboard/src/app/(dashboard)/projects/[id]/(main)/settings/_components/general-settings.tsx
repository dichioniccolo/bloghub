import { Role } from "@acme/db";

import { getProjectUserRole, type GetProject } from "~/lib/shared/api/projects";
import { CustomDomain, CustomDomainPlaceholder } from "./custom-domain";
import { DeleteProject, DeleteProjectPlaceholder } from "./delete-project";
import { QuitProject, QuitProjectPlaceholder } from "./quit-project";

type Props = {
  project: NonNullable<GetProject>;
};

export async function GeneralSettings({ project }: Props) {
  const role = await getProjectUserRole(project.id);

  if (role !== Role.OWNER) {
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
