CREATE TABLE `accounts` (
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
	PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `automaticEmails` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`type` int NOT NULL,
	`userId` varchar(255) NOT NULL,
	`projectId` varchar(255) NOT NULL);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`userId` varchar(255) NOT NULL,
	`postId` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`parentId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()));
--> statement-breakpoint
CREATE TABLE `emailNotificationSettings` (
	`userId` varchar(255) NOT NULL,
	`type` int NOT NULL,
	`value` boolean NOT NULL DEFAULT true,
	PRIMARY KEY(`type`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`userId` varchar(255) NOT NULL,
	`postId` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	PRIMARY KEY(`postId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`projectId` varchar(255),
	`postId` varchar(255),
	`type` int NOT NULL,
	`url` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()));
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`userId` varchar(255) NOT NULL,
	`type` int NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`body` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()));
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`projectId` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` varchar(255),
	`content` json NOT NULL,
	`thumbnailUrl` text,
	`slug` varchar(255) NOT NULL,
	`hidden` boolean NOT NULL DEFAULT true,
	`seoTitle` varchar(255),
	`seoDescription` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()));
--> statement-breakpoint
CREATE TABLE `projectInvitations` (
	`projectId` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	PRIMARY KEY(`email`,`projectId`)
);
--> statement-breakpoint
CREATE TABLE `projectMembers` (
	`projectId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL DEFAULT 'editor',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	PRIMARY KEY(`projectId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`name` varchar(255) NOT NULL,
	`logo` text,
	`domain` varchar(255) NOT NULL,
	`domainVerified` boolean NOT NULL DEFAULT false,
	`domainLastCheckedAt` timestamp,
	`domainUnverifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()));
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sessionToken` varchar(500) PRIMARY KEY NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`name` text,
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp,
	`image` text,
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`stripePriceId` varchar(255),
	`dayWhenBillingStarts` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()));
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(500) NOT NULL,
	`expires` timestamp NOT NULL,
	PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE TABLE `visits` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`projectId` varchar(255) NOT NULL,
	`postId` varchar(255),
	`body` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()));
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_unique_index` ON `posts` (`projectId`,`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `projectMembers_unique_index` ON `projectMembers` (`projectId`,`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_unique_index` ON `users` (`email`);