"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { AppRoutes } from "@acme/common/routes";
import {
  Button,
  buttonVariants,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { acceptInvite } from "~/lib/shared/actions/accept-invite";
import { type GetPendingInvite } from "~/lib/shared/api/projects";
import { useZact } from "~/lib/zact/client";

type Props = {
  project: NonNullable<GetPendingInvite>["project"];
  expired: boolean;
};

export function AcceptInviteDialog({ project, expired }: Props) {
  const user = useUser();

  const { toast } = useToast();

  const router = useRouter();

  const { mutate, isRunning: loading } = useZact(acceptInvite);

  const onSubmit = async () => {
    await mutate({
      userId: user.id,
      projectId: project.id,
    });

    toast({
      description: "You now are a part of this project!",
    });

    router.push(AppRoutes.ProjectDashboard(project.id));
  };

  return (
    <div>
      <Dialog open>
        <DialogContent>
          {!expired ? (
            <DialogHeader>
              <DialogTitle>Project Invitation</DialogTitle>
              <DialogDescription>
                You&apos;ve been invited to join and collaborate on the{" "}
                <span className="font-mono text-purple-600">
                  {project.name || "......"}
                </span>{" "}
                project
              </DialogDescription>
              <DialogFooter>
                <Button
                  className="mt-4 w-full"
                  disabled={loading}
                  onClick={onSubmit}
                >
                  {loading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Accept invite
                </Button>
              </DialogFooter>
            </DialogHeader>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Project Invitation Expired</DialogTitle>
                <DialogDescription>
                  This invite has expired or is no longer valid.
                </DialogDescription>
                <DialogFooter>
                  <Link href={AppRoutes.Dashboard} className={buttonVariants()}>
                    Back to dashboard
                  </Link>
                </DialogFooter>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
