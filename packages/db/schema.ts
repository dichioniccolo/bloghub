import { type JSONContent } from "@tiptap/core";
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

import {
  NotificationStatus,
  Role,
  type AutomaticEmailType,
  type EmailNotificationSettingType,
  type MediaEnumType,
  type NotificationStatusType,
  type NotificationType,
  type RoleType,
  type VisitBody,
} from "./types";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
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

export const accounts = pgTable(
  "accounts",
  {
    userId: varchar("userId", { length: 255 })
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
  userId: varchar("userId", { length: 255 })
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

export const emailNotificationSettings = pgTable(
  "emailNotificationSettings",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    type: integer("type").$type<EmailNotificationSettingType>().notNull(),
    value: boolean("value").notNull().default(true),
  },
  (emailNotificationSettings) => ({
    compoundKey: primaryKey(
      emailNotificationSettings.userId,
      emailNotificationSettings.type,
    ),
  }),
);

export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  type: integer("type").$type<NotificationType>().notNull(),
  status: integer("status")
    .$type<NotificationStatusType>()
    .notNull()
    .default(NotificationStatus.Unread),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: json("body").$type<any>().notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
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

export const projectMembers = pgTable(
  "projectMembers",
  {
    projectId: varchar("projectId", { length: 255 })
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    role: integer("role").$type<RoleType>().notNull().default(Role.Editor),
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
    projectId: varchar("projectId", { length: 255 })
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
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

export const posts = pgTable(
  "posts",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    projectId: varchar("projectId", { length: 255 })
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
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

export const likes = pgTable(
  "likes",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    postId: varchar("postId", { length: 255 })
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
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  postId: varchar("postId", { length: 255 })
    .notNull()
    .references(() => posts.id, {
      onDelete: "cascade",
    }),
  content: text("content").notNull(),
  parentId: varchar("parentId", { length: 255 }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const media = pgTable("media", {
  id: varchar("id", { length: 255 }).primaryKey(),
  projectId: varchar("projectId", { length: 255 }).references(
    () => projects.id,
    {
      onDelete: "set null",
    },
  ),
  postId: varchar("postId", { length: 255 }).references(() => posts.id, {
    onDelete: "set null",
  }),
  type: integer("type").$type<MediaEnumType>().notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const emailTypeEnum = pgEnum("EmailType", [
  "invalid_domain",
  "near_monthly_maximum_usage",
  "monthly_maximum_usage_exceeded",
]);

export const automaticEmails = pgTable("automaticEmails", {
  id: serial("id").primaryKey(),
  type: integer("type").$type<AutomaticEmailType>().notNull(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("projectId", { length: 255 })
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
    }),
});

export const visits = pgTable("visits", {
  id: serial("id").primaryKey(),
  projectId: varchar("projectId", { length: 255 })
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
    }),
  postId: varchar("postId", { length: 255 }).references(() => posts.id, {
    onDelete: "set null",
  }),
  body: json("body").$type<VisitBody>().notNull(),
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
