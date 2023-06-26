"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@acme/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/components/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/components/form";
import { Input } from "@acme/ui/components/input";
import { Form } from "@acme/ui/components/zod-form";
import { useZact } from "@acme/zact/client";

import { inviteUser } from "~/app/_actions/project/invite-user";
import { Icons } from "~/app/_components/icons";
import {
  InviteMemberSchema,
  type InviteMemberSchemaType,
} from "~/lib/validation/schema";

type Props = {
  projectId: string;
};

export function InviteMemberDialog({ projectId }: Props) {
  const [open, setOpen] = useState(false);

  const { mutate } = useZact(inviteUser, {
    onSuccess: () => {
      toast.success("Invitation sent");
      setOpen(false);
    },
  });

  const onSubmit = ({ email }: InviteMemberSchemaType) =>
    mutate({
      email,
      projectId,
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
          schema={InviteMemberSchema}
          onSubmit={onSubmit}
          className="flex flex-col space-y-6 text-left"
        >
          {({ formState: { isSubmitting } }) => (
            <>
              <FormField
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
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isSubmitting}>
                {isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Invite
              </Button>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
