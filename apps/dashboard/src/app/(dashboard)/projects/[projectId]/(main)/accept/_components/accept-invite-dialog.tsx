"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppRoutes } from "@acme/lib/routes";
import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Link } from "@acme/ui/components/link";
import { Button, buttonVariants } from "@acme/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/components/ui/dialog";

import { acceptInvite } from "~/app/_actions/project/accept-invite";
import type { GetPendingInvite } from "~/app/_api/projects";

interface Props {
  project: NonNullable<GetPendingInvite>["project"];
  expired: boolean;
}

export function AcceptInviteDialog({ project, expired }: Props) {
  const { action, status } = useServerAction(acceptInvite, {
    onServerError(error) {
      error && toast.error(error);
    },
    onSuccess: () => {
      toast.success(`You now are a part of ${project.name} project!`);
    },
  });

  const onSubmit = () =>
    action({
      projectId: project.id,
    });

  return (
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
                disabled={status === SubmissionStatus.PENDING}
                onClick={onSubmit}
              >
                {status === SubmissionStatus.PENDING && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
  );
}
