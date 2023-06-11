"use client";

import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from "@acme/ui";
import { useZact } from "@acme/zact/client";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { inviteUser } from "~/lib/shared/actions/project/invite-user";
import {
  InviteMemberSchema,
  type InviteMemberSchemaType,
} from "~/lib/validation/schema";

type Props = {
  projectId: string;
};

export function InviteMemberDialog({ projectId }: Props) {
  const [open, setOpen] = useState(false);

  const user = useUser();

  const { toast } = useToast();

  const { mutate } = useZact(inviteUser);

  async function onSubmit({ email }: InviteMemberSchemaType) {
    await mutate({
      email,
      projectId,
      userId: user.id,
    });

    toast({
      title: "Invitation sent",
    });

    setOpen(false);
  }

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
