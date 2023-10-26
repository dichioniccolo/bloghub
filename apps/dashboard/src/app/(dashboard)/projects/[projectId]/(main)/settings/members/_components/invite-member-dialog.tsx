"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { inviteUser } from "~/app/_actions/project/invite-user";
import type { InviteMemberSchemaType } from "~/lib/validation/schema";
import { InviteMemberSchema } from "~/lib/validation/schema";
import { useZact } from "~/lib/zact/client";

interface Props {
  projectId: string;
}

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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Invite
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
