import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 256 }).primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    stripeCustomerId: varchar("stripeCustomerId", { length: 256 }),
    stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 256 }),
    stripePriceId: varchar("stripePriceId", { length: 256 }),
    dayWhenbillingStarts: timestamp("dayWhenbillingStarts", { mode: "date" })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (users) => {
    return {
      emailUniqueIndex: uniqueIndex("email_unique_index").on(users.email),
    };
  },
);

export const accounts = pgTable(
  "accounts",
  {
    userId: varchar("userId", { length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: varchar("userId", { length: 256 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const emailNotificationSettingTypeEnum = pgEnum(
  "EmailNotificationSettingType",
  ["communication", "marketing", "social", "security"],
);

export const emailNotificationSettings = pgTable(
  "emailNotificationSettings",
  {
    userId: varchar("userId", { length: 256 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    type: emailNotificationSettingTypeEnum("type").notNull(),
    value: boolean("value").notNull().default(true),
  },
  (emailNotificationSettings) => ({
    compoundKey: primaryKey(
      emailNotificationSettings.userId,
      emailNotificationSettings.type,
    ),
  }),
);

export const notificationTypeEnum = pgEnum("NotificationType", [
  "project_invitation",
  "removed_from_project",
]);

export const notificationStatus = pgEnum("NotificationStatus", [
  "unread",
  "read",
  "archived",
]);

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    notificationId: varchar("notificationId", { length: 256 }).notNull(),
    userId: varchar("userId", { length: 256 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    type: notificationTypeEnum("type").notNull(),
    status: notificationStatus("status").notNull().default("unread"),
    body: json("body").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (notifications) => ({
    uniqueIndex: uniqueIndex("notifications_unique_index").on(
      notifications.notificationId,
      notifications.userId,
    ),
  }),
);

export const projects = pgTable("projects", {
  id: varchar("id", { length: 256 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  logo: text("logo"),
  domain: varchar("domain", { length: 256 }).notNull(),
  domainVerified: boolean("domainVerified").notNull().default(false),
  domainLastCheckedAt: timestamp("domainLastCheckedAt", { mode: "date" }),
  domainUnverifiedAt: timestamp("domainUnverifiedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const roleEnum = pgEnum("Role", ["owner", "editor"]);

export const projectMembers = pgTable(
  "projectMembers",
  {
    projectId: varchar("projectId", { length: 256 })
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
    userId: varchar("userId", { length: 256 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    role: roleEnum("role").notNull().default("editor"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  },
  (projectMembers) => ({
    compoundKey: primaryKey(projectMembers.projectId, projectMembers.userId),
    uniqueIndex: uniqueIndex("projectMembers_unique_index").on(
      projectMembers.projectId,
      projectMembers.userId,
    ),
  }),
);

export const projectInvitations = pgTable(
  "projectInvitations",
  {
    projectId: varchar("projectId", { length: 256 })
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
    email: varchar("email", { length: 256 }).notNull(),
    expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  },
  (projectInvitations) => ({
    compoundKey: primaryKey(
      projectInvitations.projectId,
      projectInvitations.email,
    ),
  }),
);

export const posts = pgTable(
  "posts",
  {
    id: varchar("id", { length: 256 }).primaryKey(),
    projectId: varchar("projectId", { length: 256 })
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    content: text("content").notNull(),
    thumbnailUrl: text("thumbnailUrl"),
    slug: varchar("slug", { length: 256 }).notNull(),
    hidden: boolean("hidden").notNull().default(true),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  },
  (posts) => ({
    uniqueIndex: uniqueIndex("posts_unique_index").on(
      posts.projectId,
      posts.slug,
    ),
  }),
);

export const likes = pgTable(
  "likes",
  {
    userId: varchar("userId", { length: 256 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    postId: varchar("postId", { length: 256 })
      .notNull()
      .references(() => posts.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  },
  (likes) => ({
    compoundKey: primaryKey(likes.userId, likes.postId),
  }),
);

export const comments = pgTable("comments", {
  id: varchar("id", { length: 256 }).primaryKey(),
  userId: varchar("userId", { length: 256 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  postId: varchar("postId", { length: 256 })
    .notNull()
    .references(() => posts.id, {
      onDelete: "cascade",
    }),
  content: text("content").notNull(),
  parentId: varchar("parentId", { length: 256 }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const mediaTypeEnum = pgEnum("MediaType", ["image", "video", "audio"]);

export const media = pgTable("media", {
  id: varchar("id", { length: 256 }).primaryKey(),
  projectId: varchar("projectId", { length: 256 }).references(
    () => projects.id,
    {
      onDelete: "set null",
    },
  ),
  postId: varchar("postId", { length: 256 }).references(() => posts.id, {
    onDelete: "set null",
  }),
  type: mediaTypeEnum("type").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const emailTypeEnum = pgEnum("EmailType", [
  "invalid_domain",
  "near_monthly_maximum_usage",
  "monthly_maximum_usage_exceeded",
]);

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  type: emailTypeEnum("type").notNull(),
  userId: varchar("userId", { length: 256 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("projectId", { length: 256 })
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
    }),
});

export const visits = pgTable("visits", {
  id: serial("id").primaryKey(),
  projectId: varchar("projectId", { length: 256 })
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
    }),
  postId: varchar("postId", { length: 256 }).references(() => posts.id, {
    onDelete: "set null",
  }),
  browserName: varchar("browserName", { length: 256 }),
  browserVersion: varchar("browserVersion", { length: 256 }),
  osName: varchar("osName", { length: 256 }),
  osVersion: varchar("osVersion", { length: 256 }),
  deviceType: varchar("deviceType", { length: 256 }),
  deviceVendor: varchar("deviceVendor", { length: 256 }),
  deviceModel: varchar("deviceModel", { length: 256 }),
  engineName: varchar("engineName", { length: 256 }),
  engineVersion: varchar("engineVersion", { length: 256 }),
  cpuArchitecture: varchar("cpuArchitecture", { length: 256 }),
  city: varchar("city", { length: 256 }),
  region: varchar("region", { length: 256 }),
  country: varchar("country", { length: 256 }),
  latitude: varchar("latitude", { length: 256 }),
  longitude: varchar("longitude", { length: 256 }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

// export const postTags = pgTable(
//   "postTags",
//   {
//     postId: uuid("postId").notNull(),
//     tag: varchar("tag", { length: 256 }).notNull(),
//   },
//   (postTags) => ({
//     compoundKey: primaryKey(postTags.postId, postTags.tag),
//   }),
// );

/// RELATIONS
export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  notifications: many(notifications),
  memberOfProjects: many(projectMembers),
  emailNotificationSettings: many(emailNotificationSettings),
  likedPosts: many(likes),
  comments: many(comments),
  emails: many(emails),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const emailNotificationSettingsRelations = relations(
  emailNotificationSettings,
  ({ one }) => ({
    user: one(users, {
      fields: [emailNotificationSettings.userId],
      references: [users.id],
    }),
  }),
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  projectMembers: many(projectMembers),
  projectInvitations: many(projectInvitations),
  posts: many(posts),
  media: many(media),
  emails: many(emails),
  visits: many(visits),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

export const projectInvitationsRelations = relations(
  projectInvitations,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectInvitations.projectId],
      references: [projects.id],
    }),
  }),
);

export const postsRelations = relations(posts, ({ one, many }) => ({
  project: one(projects, {
    fields: [posts.projectId],
    references: [projects.id],
  }),
  likedBy: many(likes),
  comments: many(comments),
  media: many(media),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  children: many(comments),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  project: one(projects, {
    fields: [media.projectId],
    references: [projects.id],
  }),
  post: one(posts, {
    fields: [media.postId],
    references: [posts.id],
  }),
}));

export const emailsRelations = relations(emails, ({ one }) => ({
  user: one(users, {
    fields: [emails.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [emails.projectId],
    references: [projects.id],
  }),
}));

export const visitsRelations = relations(visits, ({ one }) => ({
  project: one(projects, {
    fields: [visits.projectId],
    references: [projects.id],
  }),
  post: one(posts, {
    fields: [visits.postId],
    references: [posts.id],
  }),
}));
