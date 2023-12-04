import type { InferSelectModel } from "drizzle-orm";

import type { projectMembers } from "./schema";

export type ProjectMember = InferSelectModel<typeof projectMembers>;

export type Role = ProjectMember["role"];
