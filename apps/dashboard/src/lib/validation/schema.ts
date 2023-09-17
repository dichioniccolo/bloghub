import { z } from "zod";

const domainRegex =
  /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export const UserAuthSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email address",
    }),
});

export type UserAuthSchemaType = z.input<typeof UserAuthSchema>;

export const UserNameSchema = z.object({
  name: z.string().nonempty(),
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
  domain: z
    .string({
      required_error: "Domain is required",
    })
    .regex(domainRegex, { message: "Invalid domain" }),
});

export type CreateProjectSchemaType = z.input<typeof CreateProjectSchema>;

export const UpdateDomainSchema = z.object({
  oldDomain: z.string().regex(domainRegex),
  newDomain: z.string().regex(domainRegex, { message: "Invalid domain" }),
  confirm: z.literal("yes, change my domain", {
    errorMap: () => ({
      message: "Please confirm the domain change",
    }),
  }),
});

export type UpdateDomainSchemaType = z.input<typeof UpdateDomainSchema>;

export const InviteMemberSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email address",
    }),
});

export type InviteMemberSchemaType = z.input<typeof InviteMemberSchema>;

export const EditPostSchema = z.object({
  title: z.string(),
  description: z.string().optional().nullable(),
  content: z.any(),
});

export type EditPostSchemaType = z.input<typeof EditPostSchema>;

export const EditNotificationsSchema = z.object({
  communication_emails: z.coerce.boolean().default(true),
  marketing_emails: z.coerce.boolean().default(true),
  social_emails: z.coerce.boolean().default(true),
  security_emails: z.literal(true),
});

export type EditNotificationsSchemaType = z.input<
  typeof EditNotificationsSchema
>;

export const AiGenerateSchema = z.object({
  type: z
    .enum(["completion", "summarize", "fix_grammar_spelling"])
    .default("completion"),
  prompt: z.string().nonempty(),
});

export const PublishPostSchema = z.object({
  slug: z
    .string({
      required_error: "Slug is required",
    })
    .nonempty({
      message: "Slug is required",
    })
    .regex(/^[a-z0-9-]+$/i, {
      message:
        "Slug must be alphanumeric and contain no spaces or special characters (only dashes are allowed)",
    }),
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
