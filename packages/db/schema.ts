import { type JSONContent } from "@tiptap/core";
import { relations, type InferModel } from "drizzle-orm";
import {
  boolean,
  int,
  json,
  mysqlTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

import {
  NotificationStatus,
  Role,
  type AutomaticEmailType,
  type EmailNotificationSettingType,
  type MediaEnumType,
  type NotificationStatusType,
  type NotificationType,
  type RoleType,
} from "./types";

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: text("name"),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
    stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
    stripePriceId: varchar("stripePriceId", { length: 255 }),
    dayWhenBillingStarts: timestamp("dayWhenBillingStarts", { mode: "date" })
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

export const accounts = mysqlTable(
  "accounts",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = mysqlTable("sessions", {
  sessionToken: varchar("sessionToken", {
    length: 500,
  })
    .notNull()
    .primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 500 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const emailNotificationSettings = mysqlTable(
  "emailNotificationSettings",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: int("type").$type<EmailNotificationSettingType>().notNull(),
    value: boolean("value").notNull().default(true),
  },
  (emailNotificationSettings) => ({
    compoundKey: primaryKey(
      emailNotificationSettings.userId,
      emailNotificationSettings.type,
    ),
  }),
);

export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  type: int("type").$type<NotificationType>().notNull(),
  status: int("status")
    .$type<NotificationStatusType>()
    .notNull()
    .default(NotificationStatus.Unread),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: json("body").$type<any>().notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const projects = mysqlTable("projects", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logo: text("logo"),
  domain: varchar("domain", { length: 255 }).notNull(),
  domainVerified: boolean("domainVerified").notNull().default(false),
  domainLastCheckedAt: timestamp("domainLastCheckedAt", { mode: "date" }),
  domainUnverifiedAt: timestamp("domainUnverifiedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const projectMembers = mysqlTable(
  "projectMembers",
  {
    projectId: varchar("projectId", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }),
    role: varchar("role", {
      length: 255,
    })
      .$type<RoleType>()
      .notNull()
      .default(Role.Editor),
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

export const projectInvitations = mysqlTable(
  "projectInvitations",
  {
    projectId: varchar("projectId", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
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

export const posts = mysqlTable(
  "posts",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    projectId: varchar("projectId", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    content: json("content").$type<JSONContent>().notNull(),
    thumbnailUrl: text("thumbnailUrl"),
    slug: varchar("slug", { length: 255 }).notNull(),
    hidden: boolean("hidden").notNull().default(true),
    seoTitle: varchar("seoTitle", { length: 255 }),
    seoDescription: varchar("seoDescription", { length: 255 }),
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

export const likes = mysqlTable(
  "likes",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    postId: varchar("postId", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  },
  (likes) => ({
    compoundKey: primaryKey(likes.userId, likes.postId),
  }),
);

export const comments = mysqlTable("comments", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  postId: varchar("postId", { length: 255 }).notNull(),
  content: text("content").notNull(),
  parentId: varchar("parentId", { length: 255 }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const media = mysqlTable("media", {
  id: varchar("id", { length: 255 }).primaryKey(),
  projectId: varchar("projectId", { length: 255 }),
  postId: varchar("postId", { length: 255 }),
  type: int("type").$type<MediaEnumType>().notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const automaticEmails = mysqlTable("automaticEmails", {
  id: serial("id").primaryKey(),
  type: int("type").$type<AutomaticEmailType>().notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  projectId: varchar("projectId", { length: 255 }).notNull(),
});

export const visits = mysqlTable("visits", {
  id: serial("id").primaryKey(),
  projectId: varchar("projectId", { length: 255 }).notNull(),
  postId: varchar("postId", { length: 255 }),
  browserName: varchar("browserName", { length: 255 }),
  browserVersion: varchar("browserVersion", { length: 255 }),
  osName: varchar("osName", { length: 255 }),
  osVersion: varchar("osVersion", { length: 255 }),
  deviceModel: varchar("deviceModel", { length: 255 }),
  deviceType: varchar("deviceType", { length: 255 }),
  deviceVendor: varchar("deviceVendor", { length: 255 }),
  engineName: varchar("engineName", { length: 255 }),
  engineVersion: varchar("engineVersion", { length: 255 }),
  cpuArchitecture: varchar("cpuArchitecture", { length: 255 }),
  geoCountry: varchar("geoCountry", { length: 255 }),
  geoRegion: varchar("geoRegion", { length: 255 }),
  geoCity: varchar("geoCity", { length: 255 }),
  geoLatitude: varchar("geoLatitude", { length: 255 }),
  geoLongitude: varchar("geoLongitude", { length: 255 }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

/// RELATIONS
export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  notifications: many(notifications),
  memberOfProjects: many(projectMembers),
  emailNotificationSettings: many(emailNotificationSettings),
  likedPosts: many(likes),
  comments: many(comments),
  automaticEmails: many(automaticEmails),
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
  automaticEmails: many(automaticEmails),
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

export const automaticEmailsRelations = relations(
  automaticEmails,
  ({ one }) => ({
    user: one(users, {
      fields: [automaticEmails.userId],
      references: [users.id],
    }),
    project: one(projects, {
      fields: [automaticEmails.projectId],
      references: [projects.id],
    }),
  }),
);

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

export type Project = InferModel<typeof projects>;
