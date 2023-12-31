import { z } from "zod";

import { DOMAIN_REGEX } from "@acme/lib/constants";

export const RequiredString = z
  .string({
    required_error: "Cannot be empty",
    invalid_type_error: "Must be a string",
  })
  .min(1, { message: "Cannot be empty" });

export const RequiredEmail = RequiredString.email({
  message: "Invalid email address",
});

export const DomainSchema = z
  .string()
  .regex(DOMAIN_REGEX, { message: "Invalid domain" });

export const UserAuthSchema = z.object({
  email: RequiredEmail,
});

export type UserAuthSchemaType = z.input<typeof UserAuthSchema>;

export const UserNameSchema = z.object({
  name: RequiredString,
});

export type UserNameSchemaType = z.input<typeof UserNameSchema>;

export const CreateProjectSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Project name must be at least 3 characters long",
    })
    .max(50, {
      message: "Project name must be less than 50 characters long",
    }),
  domain: DomainSchema,
});

export type CreateProjectSchemaType = z.input<typeof CreateProjectSchema>;

export const UpdateDomainSchema = z.object({
  oldDomain: DomainSchema,
  newDomain: DomainSchema,
  confirm: z.literal("yes, change my domain", {
    errorMap: () => ({
      message: "Please confirm the domain change",
    }),
  }),
});

export type UpdateDomainSchemaType = z.input<typeof UpdateDomainSchema>;

export const InviteMemberSchema = z.object({
  email: RequiredEmail,
});

export type InviteMemberSchemaType = z.input<typeof InviteMemberSchema>;

export const EditPostSchema = z.object({
  title: RequiredString,
  description: z.string().optional().nullable(),
  content: z.any(),
});

export type EditPostSchemaType = z.input<typeof EditPostSchema>;

export const EditNotificationsSchema = z.object({
  communication: z.coerce.boolean().default(true),
  marketing: z.coerce.boolean().default(true),
  social: z.coerce.boolean().default(true),
  security: z.literal(true),
});

export type EditNotificationsSchemaType = z.input<
  typeof EditNotificationsSchema
>;

export const AiGenerateSchema = z.object({
  type: z
    .enum(["completion", "summarize", "fix_grammar_spelling"])
    .default("completion"),
  prompt: z.string().min(1),
});

export const PublishPostSchema = z.object({
  thumbnailUrl: z.string().url().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export type PublishPostSchemaType = z.input<typeof PublishPostSchema>;

export const ProjectNameSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Project name must be at least 3 characters long",
    })
    .max(50, {
      message: "Project name must be less than 50 characters long",
    }),
});

export type ProjectNameSchemaType = z.input<typeof ProjectNameSchema>;

export const ProjectSocialsSchema = z
  .object({
    socials: z.array(
      z.object({
        social: RequiredString,
        value: z.string().optional().nullable(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const socials = data.socials as { social: string; value: string }[];
    const socialsMap = new Map<string, string>();
    for (const { social, value } of socials) {
      if (socialsMap.has(social)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate social: ${social}`,
          path: ["socials"],
        });
      } else {
        socialsMap.set(social, value);
      }

      if (value.startsWith("https://")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Social value must not start with https://`,
          path: ["socials"],
        });
      }

      if (value.endsWith("/")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Social value must not end with /`,
          path: ["socials"],
        });
      }

      if (value.includes(" ")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Social value must not contain spaces`,
          path: ["socials"],
        });
      }
    }

    return data;
  });

export type ProjectSocialsSchemaType = z.input<typeof ProjectSocialsSchema>;
