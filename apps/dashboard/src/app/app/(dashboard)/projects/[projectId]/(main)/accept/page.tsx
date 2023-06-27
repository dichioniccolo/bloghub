import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { getPendingInvite } from "~/app/_api/projects";
import { authOptions } from "~/lib/auth";
import { AppRoutes } from "~/lib/common/routes";
import { AcceptInviteDialog } from "./_components/accept-invite-dialog";

type Props = {
  params: {
    projectId: string;
  };
};

export async function generateMetadata({
  params: { projectId },
}: Props): Promise<Metadata> {
  const session = await getServerSession(authOptions);

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
  const session = await getServerSession(authOptions);

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
