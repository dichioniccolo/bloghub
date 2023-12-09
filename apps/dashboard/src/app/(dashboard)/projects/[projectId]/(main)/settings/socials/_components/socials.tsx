"use client";

import type { ReactNode } from "react";
import { Github } from "lucide-react";
import { toast } from "sonner";

import type { ProjectSocialType } from "@acme/db";
import { useServerAction } from "@acme/server-actions/client";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { upsertSocials } from "~/app/_actions/project/upsert-socials";
import { SubmitButton } from "~/components/submit-button";
import type { ProjectSocialsSchemaType } from "~/lib/validation/schema";
import { ProjectSocialsSchema } from "~/lib/validation/schema";

const defaultSocials = [
  {
    type: "GITHUB",
    icon: <Github />,
  },
] satisfies {
  type: ProjectSocialType;
  icon: ReactNode;
}[];

interface Props {
  projectId: string;
  socials: {
    social: ProjectSocialType;
    value: string;
  }[];
}

export function Socials({ projectId, socials }: Props) {
  const { action } = useServerAction(upsertSocials, {
    onServerError: (error) => {
      error && toast.error(error);
    },
  });

  const onSubmit = ({ socials }: ProjectSocialsSchemaType) =>
    action({
      projectId,
      socials,
    });

  const form = useZodForm({
    schema: ProjectSocialsSchema,
    defaultValues: {
      socials: defaultSocials.map((social) => ({
        social: social.type,
        value: socials.find((x) => x.social === social.type)?.value ?? "",
      })),
    },
  });

  return (
    <Form form={form} onSubmit={onSubmit}>
      {/* {defaultSocials.map((social) => (
        <div key={social.type} className="flex items-center gap-2">
          <span>{social.icon}</span>
          <Input
            placeholder={social.type}
            defaultValue={
              socials.find((x) => x.social === social.type)?.value ?? ""
            }
          />
        </div>
      ))} */}
      <SubmitButton>Save</SubmitButton>
    </Form>
  );
}
