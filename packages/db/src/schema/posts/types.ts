import type { InferSelectModel } from "drizzle-orm";

import type { posts } from "./schema";

export type Post = InferSelectModel<typeof posts>;
