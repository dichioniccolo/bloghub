import type { Metadata, ServerRuntime } from "next";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";
import { AppRoutes } from "@acme/lib/routes";

import { getPendingInvite } from "~/app/_api/projects";
import { AcceptInviteDialog } from "./_components/accept-invite-dialog";

interface Props {
  params: {
    projectId: string;
  };
}

export const runtime: ServerRuntime = "edge";

export async function generateMetadata({
  params: { projectId },
}: Props): Promise<Metadata> {
  const session = await auth();

  if (!session) {
    return redirect(AppRoutes.Login);
  }

  const { user } = session;

  const pendingInvite = await getPendingInvite(user.email, projectId);

  return {
    title: `Accept invitation to project ${pendingInvite?.project?.name}`,
  };
}

export default async function AcceptProjectInvitationPage({
  params: { projectId },
}: Props) {
  const session = await auth();

  if (!session) {
    return redirect(AppRoutes.Login);
  }

  const { user } = session;

  const pendingInvite = await getPendingInvite(user.email, projectId);

  if (!pendingInvite) {
    return redirect(AppRoutes.Dashboard);
  }

  return (
    <AcceptInviteDialog
      project={pendingInvite.project}
      expired={pendingInvite.expiresAt <= new Date()}
    />
  );
}
