-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `account` (
	`userId` varchar(255) NOT NULL,
	`type` text NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	CONSTRAINT `account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `automaticEmails` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`type` enum('INVALID_DOMAIN','NEAR_MONTHLY_LIMIT','MONTHLY_LIMIT_REACHED') NOT NULL,
	`userId` varchar(255) NOT NULL,
	`projectId` varchar(255) NOT NULL,
	CONSTRAINT `automaticEmails_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `id` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailNotificationSettings` (
	`userId` varchar(255) NOT NULL,
	`type` enum('COMMUNICATION','MARKETING','SOCIAL','SECURITY') NOT NULL,
	`value` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `emailNotificationSettings_type_userId_pk` PRIMARY KEY(`type`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`userId` varchar(255) NOT NULL,
	`postId` varchar(255) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `likes_postId_userId_pk` PRIMARY KEY(`postId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` varchar(255) NOT NULL,
	`projectId` varchar(255),
	`postId` varchar(255),
	`type` enum('IMAGE','VIDEO','AUDIO','DOCUMENT') NOT NULL DEFAULT 'IMAGE',
	`url` text NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`forEntity` enum('POST_CONTENT','POST_THUMBNAIL','PROJECT_LOGO') NOT NULL DEFAULT 'POST_CONTENT',
	CONSTRAINT `media_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`type` enum('PROJECT_INVITATION','REMOVED_FROM_PROJECT','INVITATION_ACCEPTED') NOT NULL,
	`status` enum('UNREAD','READ','ARCHIVED') NOT NULL DEFAULT 'UNREAD',
	`body` json NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `notifications_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` varchar(255) NOT NULL,
	`projectId` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` varchar(255),
	`content` json NOT NULL,
	`thumbnailUrl` text,
	`slug` varchar(255) NOT NULL,
	`hidden` tinyint NOT NULL DEFAULT 1,
	`seoTitle` varchar(255),
	`seoDescription` varchar(255),
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `posts_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `posts_unique_index` UNIQUE(`projectId`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `projectInvitations` (
	`projectId` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`expiresAt` datetime(3) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `projectInvitations_email_projectId_pk` PRIMARY KEY(`email`,`projectId`)
);
--> statement-breakpoint
CREATE TABLE `projectMembers` (
	`projectId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`role` enum('OWNER','EDITOR') NOT NULL DEFAULT 'EDITOR',
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `projectMembers_projectId_userId_pk` PRIMARY KEY(`projectId`,`userId`),
	CONSTRAINT `projectMembers_unique_index` UNIQUE(`projectId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`logo` text,
	`domain` varchar(255) NOT NULL,
	`domainVerified` tinyint NOT NULL DEFAULT 0,
	`domainLastCheckedAt` datetime(3),
	`domainUnverifiedAt` datetime(3),
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`deletedAt` datetime(3),
	CONSTRAINT `projects_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` varchar(500) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `session_sessionToken_pk` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` text,
	`email` varchar(255) NOT NULL,
	`emailVerified` datetime(3),
	`image` text,
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`stripePriceId` varchar(255),
	`dayWhenBillingStarts` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `user_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `email_unique_index` UNIQUE(`email`),
	CONSTRAINT `user_stripeCustomerId_key` UNIQUE(`stripeCustomerId`)
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(500) NOT NULL,
	`expires` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `verificationToken_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE TABLE `visits` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`projectId` varchar(255) NOT NULL,
	`postId` varchar(255),
	`browserName` varchar(255),
	`browserVersion` varchar(255),
	`osName` varchar(255),
	`osVersion` varchar(255),
	`deviceModel` varchar(255),
	`deviceType` varchar(255),
	`deviceVendor` varchar(255),
	`engineName` varchar(255),
	`engineVersion` varchar(255),
	`cpuArchitecture` varchar(255),
	`geoCountry` varchar(255),
	`geoRegion` varchar(255),
	`geoCity` varchar(255),
	`geoLatitude` varchar(255),
	`geoLongitude` varchar(255),
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`referer` varchar(255),
	CONSTRAINT `visits_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `id` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE INDEX `automaticEmails_userId_idx` ON `automaticEmails` (`userId`);--> statement-breakpoint
CREATE INDEX `automaticEmails_projectId_idx` ON `automaticEmails` (`projectId`);--> statement-breakpoint
CREATE INDEX `emailNotificationSettings_userId_idx` ON `emailNotificationSettings` (`userId`);--> statement-breakpoint
CREATE INDEX `postId_index` ON `likes` (`postId`);--> statement-breakpoint
CREATE INDEX `likes_userId_idx` ON `likes` (`userId`);--> statement-breakpoint
CREATE INDEX `media_projectId_idx` ON `media` (`projectId`);--> statement-breakpoint
CREATE INDEX `media_postId_idx` ON `media` (`postId`);--> statement-breakpoint
CREATE INDEX `notifications_userId_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `projectId_index` ON `posts` (`projectId`);--> statement-breakpoint
CREATE INDEX `projectInvitations_projectId_idx` ON `projectInvitations` (`projectId`);--> statement-breakpoint
CREATE INDEX `projectMembers_projectId_userId_role_idx` ON `projectMembers` (`projectId`,`userId`,`role`);--> statement-breakpoint
CREATE INDEX `projectMembers_projectId_idx` ON `projectMembers` (`projectId`);--> statement-breakpoint
CREATE INDEX `projectMembers_userId_idx` ON `projectMembers` (`userId`);--> statement-breakpoint
CREATE INDEX `deleted_at_index` ON `projects` (`deletedAt`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`userId`);--> statement-breakpoint
CREATE INDEX `projectId_index` ON `visits` (`projectId`);--> statement-breakpoint
CREATE INDEX `visits_postId_idx` ON `visits` (`postId`);
*/