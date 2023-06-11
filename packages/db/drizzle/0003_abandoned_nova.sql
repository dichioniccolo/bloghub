DROP INDEX IF EXISTS "notifications_unique_index";
ALTER TABLE "notifications" ALTER COLUMN "id" SET DATA TYPE varchar(256);
ALTER TABLE "notifications" DROP COLUMN IF EXISTS "notificationId";