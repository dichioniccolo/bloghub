"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@acme/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/components/dialog";

import { acceptInvite } from "~/app/_actions/project/accept-invite";
import type { GetPendingInvite } from "~/app/_api/projects";
import { AppRoutes } from "~/lib/routes";
import { useZact } from "~/lib/zact/client";

interface Props {
  project: NonNullable<GetPendingInvite>["project"];
  expired: boolean;
}

export function AcceptInviteDialog({ project, expired }: Props) {
  const router = useRouter();

  const { mutate, isRunning: loading } = useZact(acceptInvite, {
    onSuccess: () => {
      toast.success(`You now are a part of ${project.name} project!`);
      router.replace(AppRoutes.ProjectDashboard(project.id));
      router.refresh();
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
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
