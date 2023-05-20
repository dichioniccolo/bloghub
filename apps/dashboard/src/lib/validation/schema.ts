import { z } from "zod";

const domainRegex =
  /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export const UserAuthSchema = z.object({
  email: z.string().email(),
});

export type UserAuthSchemaType = z.infer<typeof UserAuthSchema>;

export const UserNameSchema = z.object({
  name: z.string(),
});

export type UserNameSchemaType = z.infer<typeof UserNameSchema>;

export const CreateProjectSchema = z.object({
  name: z.string().min(3).max(50),
  domain: z.string().regex(domainRegex, { message: "Invalid domain" }),
});

export type CreateProjectSchemaType = z.infer<typeof CreateProjectSchema>;

export const CreatePostSchema = z.object({
  title: z.string().min(3).max(128),
});

export type CreatePostSchemaType = z.infer<typeof CreatePostSchema>;

export const UpdateDomainSchema = z.object({
  oldDomain: z.string().regex(domainRegex),
  newDomain: z.string().regex(domainRegex),
  confirm: z.literal("yes, change my domain", {
    errorMap: () => ({
      message: "Please confirm the domain change",
    }),
  }),
});

export type UpdateDomainSchemaType = z.infer<typeof UpdateDomainSchema>;

export const InviteMemberSchema = z.object({
  email: z.string().email(),
});

export type InviteMemberSchemaType = z.infer<typeof InviteMemberSchema>;
