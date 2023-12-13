"use client";

import { Loader2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { toast } from "sonner";

import type { ProjectSocialType } from "@acme/db";
import { defaultSocials } from "@acme/lib";
import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@acme/ui/components/form";
import { Input } from "@acme/ui/components/input";
import { Skeleton } from "@acme/ui/components/skeleton";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { upsertSocials } from "~/app/_actions/project/upsert-socials";
import type { ProjectSocialsSchemaType } from "~/lib/validation/schema";
import { ProjectSocialsSchema } from "~/lib/validation/schema";

interface Props {
  projectId: string;
  socials: {
    social: ProjectSocialType;
    value: string;
  }[];
}

export function Socials({ projectId, socials }: Props) {
  const { action, status } = useServerAction(upsertSocials, {
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
      <SocialFormInputs />
      <Button disabled={status === SubmissionStatus.PENDING} className="mt-4">
        {status === SubmissionStatus.PENDING && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        <span>Save</span>
      </Button>
    </Form>
  );
}

function SocialFormInputs() {
  const { fields } = useFieldArray<ProjectSocialsSchemaType>({
    name: "socials",
  });

  return (
    <div className="grid gap-2">
      {fields.map((field, index) => (
        <FormField<ProjectSocialsSchemaType>
          key={field.id}
          name={`socials.${index}.value`}
          render={({ field: renderField }) => {
            const defaultSocial = defaultSocials.find(
              (x) => x.type === field.social,
            );

            return (
              <FormItem>
                <div className="flex items-center gap-2">
                  {defaultSocial?.icon}
                  <FormControl>
                    <Input
                      placeholder={`Your ${
                        defaultSocial?.name ?? field.social
                      } username`}
                      autoCapitalize="none"
                      autoCorrect="off"
                      value={
                        typeof renderField.value === "object"
                          ? ""
                          : renderField.value
                      }
                      onBlur={renderField.onBlur}
                      onChange={renderField.onChange}
                      disabled={renderField.disabled}
                      name={renderField.name}
                      ref={renderField.ref}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      ))}
    </div>
  );
}

export function SocialsPlaceholder() {
  return (
    <div>
      <div className="grid gap-2">
        {defaultSocials.map((x) => (
          <div key={x.type} className="flex items-center gap-2">
            {x.icon}
            <Skeleton className="h-10 w-full px-3 py-2" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-4 h-10 w-32 px-4 py-2" />
    </div>
  );
}
