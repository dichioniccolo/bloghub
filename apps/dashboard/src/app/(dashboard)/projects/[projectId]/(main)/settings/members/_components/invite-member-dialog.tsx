"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/components/form";
import { Button } from "@acme/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/components/ui/dialog";
import { Input } from "@acme/ui/components/ui/input";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { inviteUser } from "~/app/_actions/project/invite-user";
import type { InviteMemberSchemaType } from "~/lib/validation/schema";
import { InviteMemberSchema } from "~/lib/validation/schema";

interface Props {
  projectId: string;
}

export function InviteMemberDialog({ projectId }: Props) {
  const [open, setOpen] = useState(false);

  const { action, status, validationErrors } = useServerAction(inviteUser, {
    onSuccess: () => {
      toast.success("Invitation sent");
      setOpen(false);
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const onSubmit = ({ email }: InviteMemberSchemaType) =>
    action({
      email,
      projectId,
    });

  const form = useZodForm({
    schema: InviteMemberSchema,
    defaultValues: {
      email: "",
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Teammate</DialogTitle>
          <DialogDescription>
            Invite a teammate to join your project. Invitations will be valid
            for 7 days.
          </DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={onSubmit}
          className="flex flex-col space-y-6 text-left"
        >
          <FormField<InviteMemberSchemaType>
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your@friend.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{validationErrors?.email?.[0]}</FormMessage>
              </FormItem>
            )}
          />
          <Button disabled={status === SubmissionStatus.PENDING}>
            {status === SubmissionStatus.PENDING && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Invite
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
