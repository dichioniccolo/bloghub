import type { InferSelectModel } from "drizzle-orm";

import type { emailNotificationSettings } from "./schema";

export type EmailNotificationSetting = InferSelectModel<
  typeof emailNotificationSettings
>;

export type EmailNotificationSettingType = EmailNotificationSetting["type"];
