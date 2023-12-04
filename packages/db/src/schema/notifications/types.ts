import type { InferSelectModel } from "drizzle-orm";

import type { notifications } from "./schema";

export type Notification = InferSelectModel<typeof notifications>;

export type NotificationType = Notification["type"];
export type NotificationStatus = Notification["status"];
