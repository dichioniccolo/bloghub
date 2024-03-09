import type { InferSelectModel } from "drizzle-orm";

import type { projects } from "./schema";

export type Project = InferSelectModel<typeof projects>;
