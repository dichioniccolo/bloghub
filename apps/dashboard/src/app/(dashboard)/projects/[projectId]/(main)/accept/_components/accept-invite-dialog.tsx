"use client";

import Link from "next/link";
import { AppRoutes } from "@bloghub/common/routes";
import { Button, buttonVariants } from "@bloghub/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@bloghub/ui/components/dialog";
import { useZact } from "@bloghub/zact/client";
import { toast } from "sonner";

import { acceptInvite } from "~/app/_actions/project/accept-invite";
import { type GetPendingInvite } from "~/app/_api/projects";
import { Icons } from "~/app/_components/icons";

type Props = {
  project: NonNullable<GetPendingInvite>["project"];
  expired: boolean;
};

export function AcceptInviteDialog({ project, expired }: Props) {
  const { mutate, isRunning: loading } = useZact(acceptInvite, {
    onSuccess: () => {
      toast.success(`You now are a part of ${project.name} project!`);
    },
  });

  const onSubmit = () =>
    mutate({
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
  );
}
