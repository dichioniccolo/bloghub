import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@acme/auth";

import { getPendingInvite } from "~/lib/shared/api/projects";
import { AcceptInviteDialog } from "./_components/accept-invite-dialog";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  const { user } = session;

  const pendingInvite = await getPendingInvite(user.email, id);

  return {
    title: `Accept invitation to project ${pendingInvite?.project?.name}`,
  };
}

export default async function AcceptProjectInvitationPage({
  params: { id },
}: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  const { user } = session;

  const pendingInvite = await getPendingInvite(user.email, id);

  if (!pendingInvite) {
    return redirect("/");
  }

  return (
    <AcceptInviteDialog
      project={pendingInvite.project}
      expired={pendingInvite.expiresAt <= new Date()}
    />
  );
}
