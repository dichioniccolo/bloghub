"use server";

import { z } from "zod";

import { db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { IS_NOT_OWNER_MESSAGE, isProjectOwner } from "~/app/_actions/schemas";
import { authenticatedMiddlewares } from "../middlewares/user";
import { verifyProjectDomain } from "./verify-project-domain";

export const verifyDomain = createServerAction({
  actionName: "verifyDomain",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    projectId: z.string(),
  }),
  initialState: undefined as unknown as VerifyDomain,
  action: async ({ input: { projectId }, ctx: { user } }) => {
    if (!(await isProjectOwner(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_OWNER_MESSAGE);
    }

    const project = (await db.query.projects.findFirst({
      where: eq(schema.projects.id, projectId),
      columns: {
        domain: true,
      },
    }))!;

    return await verifyProjectDomain(project.domain);
  },
});

export type VerifyDomain = Awaited<ReturnType<typeof verifyProjectDomain>>;
