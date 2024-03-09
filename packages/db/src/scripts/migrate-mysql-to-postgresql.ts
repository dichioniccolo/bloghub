import { db as dbMysql, schema as schemaMysql } from "@acme/db-mysql";

import { db, schema } from "..";

async function main() {
  const accounts = await dbMysql.select().from(schemaMysql.accounts);
  const automaticEmails = await dbMysql
    .select()
    .from(schemaMysql.automaticEmails);
  const emailNotificationSettings = await dbMysql
    .select()
    .from(schemaMysql.emailNotificationSettings);
  const likes = await dbMysql.select().from(schemaMysql.likes);
  const medium = await dbMysql.select().from(schemaMysql.media);
  const notifications = await dbMysql.select().from(schemaMysql.notifications);
  const posts = await dbMysql.select().from(schemaMysql.posts);
  const projectInvitations = await dbMysql
    .select()
    .from(schemaMysql.projectInvitations);
  const projectMembers = await dbMysql
    .select()
    .from(schemaMysql.projectMembers);
  const projects = await dbMysql.select().from(schemaMysql.projects);
  const projectSocials = await dbMysql
    .select()
    .from(schemaMysql.projectSocials);
  const sessions = await dbMysql.select().from(schemaMysql.session);
  const users = await dbMysql.select().from(schemaMysql.users);
  const verificationTokens = await dbMysql
    .select()
    .from(schemaMysql.verificationTokens);
  const visits = await dbMysql.select().from(schemaMysql.visits);

  for (const account of accounts) {
    await db.insert(schema.accounts).values(account).execute();
  }

  for (const session of sessions) {
    await db.insert(schema.session).values(session).execute();
  }

  for (const user of users) {
    await db.insert(schema.users).values(user).execute();
  }

  for (const notification of notifications) {
    await db.insert(schema.notifications).values(notification).execute();
  }

  for (const verificationToken of verificationTokens) {
    await db
      .insert(schema.verificationTokens)
      .values(verificationToken)
      .execute();
  }

  for (const project of projects) {
    await db
      .insert(schema.projects)
      .values({
        ...project,
        domainVerified: project.domainVerified === 1,
      })
      .execute();
  }

  for (const projectMember of projectMembers) {
    await db.insert(schema.projectMembers).values(projectMember).execute();
  }

  for (const projectInvitation of projectInvitations) {
    await db
      .insert(schema.projectInvitations)
      .values(projectInvitation)
      .execute();
  }

  for (const projectSocial of projectSocials) {
    await db.insert(schema.projectSocials).values(projectSocial).execute();
  }

  for (const automaticEmail of automaticEmails) {
    await db.insert(schema.automaticEmails).values(automaticEmail).execute();
  }

  for (const emailNotificationSetting of emailNotificationSettings) {
    await db
      .insert(schema.emailNotificationSettings)
      .values({
        ...emailNotificationSetting,
        value: emailNotificationSetting.value === 1,
      })
      .execute();
  }

  for (const post of posts) {
    await db
      .insert(schema.posts)
      .values({
        ...post,
        hidden: post.hidden === 1,
      })
      .execute();
  }

  for (const media of medium) {
    await db.insert(schema.media).values(media).execute();
  }

  for (const visit of visits) {
    await db.insert(schema.visits).values(visit).execute();
  }

  for (const like of likes) {
    await db.insert(schema.likes).values(like).execute();
  }
}

main()
  .then(() => {
    console.log("Finished");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
