import { type InferModel } from "drizzle-orm";

import { type projects } from "./schema";

export type Project = InferModel<typeof projects>;
