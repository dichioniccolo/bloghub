import { db as dbMysql, inArray, schema as schemaMysql } from "@acme/db-mysql";

import { prisma } from "..";

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
  const visits = await dbMysql
    .select()
    .from(schemaMysql.visits)
    .where(
      inArray(
        schemaMysql.visits.id,
        [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 28, 50, 51, 56, 57, 361, 362,
          910, 911, 912, 913, 917, 918, 938, 1624, 1625, 3363, 3364, 3365, 3366,
          3367, 3368, 3369, 3370, 3371, 3372, 3373, 3374, 3375, 3376, 3377,
          3378, 3379, 3380, 3381, 3382, 3383, 3384, 3385, 3386, 3406, 3407,
        ],
      ),
    );

  // for (const user of users) {
  //   await prisma.user.create({
  //     data: user,
  //   });
  // }

  // for (const account of accounts) {
  //   await prisma.account.createMany({
  //     data: {
  //       refresh_token: account.refreshToken,
  //       access_token: account.accessToken,
  //       expires_at: account.expiresAt,
  //       id_token: account.idToken,
  //       session_state: account.sessionState,
  //       token_type: account.tokenType,
  //       provider: account.provider,
  //       providerAccountId: account.providerAccountId,
  //       type: account.type,
  //       userId: account.userId,
  //       scope: account.scope,
  //     },
  //   });
  // }

  // for (const session of sessions) {
  //   await prisma.session.create({
  //     data: session,
  //   });
  // }

  // for (const notification of notifications) {
  //   await prisma.notifications.create({
  //     data: {
  //       ...notification,
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  //       body: notification.body as any,
  //     },
  //   });
  // }

  // for (const verificationToken of verificationTokens) {
  //   await prisma.verificationToken.create({
  //     data: verificationToken,
  //   });
  // }

  // for (const project of projects) {
  //   await prisma.projects.create({
  //     data: {
  //       ...project,
  //       domainVerified: project.domainVerified === 1,
  //     },
  //   });
  // }

  // for (const projectMember of projectMembers) {
  //   await prisma.projectMembers.create({
  //     data: projectMember,
  //   });
  // }

  // for (const projectInvitation of projectInvitations) {
  //   await prisma.projectInvitations.create({
  //     data: projectInvitation,
  //   });
  // }

  // for (const projectSocial of projectSocials) {
  //   await prisma.projectSocials.create({
  //     data: projectSocial,
  //   });
  // }

  // for (const automaticEmail of automaticEmails) {
  //   await prisma.automaticEmails.create({
  //     data: automaticEmail,
  //   });
  // }

  // for (const emailNotificationSetting of emailNotificationSettings) {
  //   await prisma.emailNotificationSettings.create({
  //     data: {
  //       ...emailNotificationSetting,
  //       value: emailNotificationSetting.value === 1,
  //     },
  //   });
  // }

  // for (const post of posts) {
  //   try {
  //     await prisma.posts.create({
  //       data: {
  //         ...post,
  //         hidden: post.hidden === 1,
  //       },
  //     });
  //   } catch {
  //     //
  //   }
  // }

  // for (const media of medium) {
  //   await prisma.media.create({
  //     data: media,
  //   });
  // }

  for (const visit of visits) {
    await prisma.visits.create({
      data: {
        ...visit,
        postId: null,
      },
    });
  }

  // for (const like of likes) {
  //   await prisma.likes.create({
  //     data: like,
  //   });
  // }
}

main()
  .then(() => {
    console.log("Finished");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
