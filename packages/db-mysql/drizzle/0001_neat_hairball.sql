CREATE TABLE `projectSocials` (
	`projectId` varchar(255) NOT NULL,
	`social` enum('GITHUB','TWITTER','DISCORD','YOUTUBE','LINKEDIN','FACEBOOK','INSTAGRAM') NOT NULL,
	`value` text NOT NULL,
	CONSTRAINT `projectSocials_projectId_social_pk` PRIMARY KEY(`projectId`,`social`),
	CONSTRAINT `projectSocials_projectId_social_unique_index` UNIQUE(`projectId`,`social`)
);
--> statement-breakpoint
CREATE INDEX `projectSocials_projectId_social_idx` ON `projectSocials` (`projectId`,`social`);--> statement-breakpoint
CREATE INDEX `projectSocials_projectId_idx` ON `projectSocials` (`projectId`);