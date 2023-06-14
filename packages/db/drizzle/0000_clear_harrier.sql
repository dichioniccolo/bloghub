DO $$ BEGIN
 CREATE TYPE "EmailNotificationSettingType" AS ENUM('communication', 'marketing', 'social', 'security');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "EmailType" AS ENUM('invalid_domain', 'near_monthly_maximum_usage', 'monthly_maximum_usage_exceeded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "MediaType" AS ENUM('image', 'video', 'audio');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "NotificationStatus" AS ENUM('unread', 'read', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "NotificationType" AS ENUM('project_invitation', 'removed_from_project');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "Role" AS ENUM('owner', 'editor');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "accounts" (
	"userId" varchar(256) NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_provider_providerAccountId" PRIMARY KEY("provider","providerAccountId");

CREATE TABLE IF NOT EXISTS "comments" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"userId" varchar(256) NOT NULL,
	"postId" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"parentId" varchar(256),
	"createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "emailNotificationSettings" (
	"userId" varchar(256) NOT NULL,
	"type" "EmailNotificationSettingType" NOT NULL,
	"value" boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS "emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "EmailType" NOT NULL,
	"userId" varchar(256) NOT NULL,
	"projectId" varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS "likes" (
	"userId" varchar(256) NOT NULL,
	"postId" varchar(256) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_postId" PRIMARY KEY("userId","postId");

CREATE TABLE IF NOT EXISTS "media" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"projectId" varchar(256),
	"postId" varchar(256),
	"type" "MediaType" NOT NULL,
	"url" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"notificationId" varchar(256) NOT NULL,
	"userId" varchar(256) NOT NULL,
	"type" "NotificationType" NOT NULL,
	"status" "NotificationStatus" DEFAULT 'unread' NOT NULL,
	"body" json NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "posts" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"projectId" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"thumbnailUrl" text,
	"slug" varchar(256) NOT NULL,
	"hidden" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "projectInvitations" (
	"projectId" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projectInvitations" ADD CONSTRAINT "projectInvitations_projectId_email" PRIMARY KEY("projectId","email");

CREATE TABLE IF NOT EXISTS "projectMembers" (
	"projectId" varchar(256) NOT NULL,
	"userId" varchar(256) NOT NULL,
	"role" "Role" DEFAULT 'editor' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projectMembers" ADD CONSTRAINT "projectMembers_projectId_userId" PRIMARY KEY("projectId","userId");

CREATE TABLE IF NOT EXISTS "projects" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"logo" text,
	"domain" varchar(256) NOT NULL,
	"domainVerified" boolean DEFAULT false NOT NULL,
	"domainLastCheckedAt" timestamp,
	"domainUnverifiedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" varchar(256) NOT NULL,
	"expires" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"stripeCustomerId" varchar(256),
	"stripeSubscriptionId" varchar(256),
	"stripePriceId" varchar(256),
	"dayWhenbillingStarts" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verificationToken" ADD CONSTRAINT "verificationToken_identifier_token" PRIMARY KEY("identifier","token");

CREATE TABLE IF NOT EXISTS "visits" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" varchar(256) NOT NULL,
	"postId" varchar(256),
	"browserName" varchar(256),
	"browserVersion" varchar(256),
	"osName" varchar(256),
	"osVersion" varchar(256),
	"deviceType" varchar(256),
	"deviceVendor" varchar(256),
	"deviceModel" varchar(256),
	"engineName" varchar(256),
	"engineVersion" varchar(256),
	"cpuArchitecture" varchar(256),
	"city" varchar(256),
	"region" varchar(256),
	"country" varchar(256),
	"latitude" varchar(256),
	"longitude" varchar(256),
	"createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "notifications_unique_index" ON "notifications" ("notificationId","userId");
CREATE UNIQUE INDEX IF NOT EXISTS "posts_unique_index" ON "posts" ("projectId","slug");
CREATE UNIQUE INDEX IF NOT EXISTS "projectMembers_unique_index" ON "projectMembers" ("projectId","userId");
CREATE UNIQUE INDEX IF NOT EXISTS "email_unique_index" ON "users" ("email");
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "emailNotificationSettings" ADD CONSTRAINT "emailNotificationSettings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "emails" ADD CONSTRAINT "emails_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "emails" ADD CONSTRAINT "emails_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "projectInvitations" ADD CONSTRAINT "projectInvitations_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "projectMembers" ADD CONSTRAINT "projectMembers_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "projectMembers" ADD CONSTRAINT "projectMembers_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "visits" ADD CONSTRAINT "visits_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "visits" ADD CONSTRAINT "visits_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
