import type { InferSelectModel } from "drizzle-orm";

import type { projectSocials } from "./schema";

export type ProjectSocial = InferSelectModel<typeof projectSocials>;

export type ProjectSocialType = ProjectSocial["social"];
