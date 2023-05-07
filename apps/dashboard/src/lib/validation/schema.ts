import { z } from "zod";

const domainRegex =
  /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export const CreateProjectSchema = z.object({
  name: z.string().min(3).max(50),
  domain: z.string().regex(domainRegex, { message: "Invalid domain" }),
});

export type CreateProject = z.infer<typeof CreateProjectSchema>;
