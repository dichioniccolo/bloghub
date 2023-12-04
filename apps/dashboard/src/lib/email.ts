import type { EmailNotificationSettingType } from "@acme/db";
import { and, db, eq, inArray, schema } from "@acme/db";
import type { CreateEmailOptions } from "@acme/emails";
import { sendMail as baseSendMail } from "@acme/emails";

type MailOptions = CreateEmailOptions & {
  type: EmailNotificationSettingType;
};
export async function sendMail({ to, type, ...options }: MailOptions) {
  const toEmails = Array.isArray(to) ? to : [to];

  const usersSettings = await fetchEmailNotificationSettings(type, toEmails);

  const emailSettingsMap = createEmailSettingsMap(usersSettings);

  const toFinal = filterEmailsBySettings(toEmails, emailSettingsMap);

  if (toFinal.length === 0) {
    return;
  }

  try {
    await baseSendMail({
      ...options,
      to,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

async function fetchEmailNotificationSettings(
  type: EmailNotificationSettingType,
  emailAddresses: string[],
) {
  const usersSettings = await db
    .select({
      value: schema.emailNotificationSettings.value,
      user: {
        email: schema.user.email,
      },
    })
    .from(schema.emailNotificationSettings)
    .innerJoin(
      schema.user,
      eq(schema.user.id, schema.emailNotificationSettings.userId),
    )
    .where(
      and(
        eq(schema.emailNotificationSettings.type, type),
        inArray(schema.user.email, emailAddresses),
      ),
    );
  return usersSettings;
}

function createEmailSettingsMap(
  usersSettings: Awaited<ReturnType<typeof fetchEmailNotificationSettings>>,
) {
  const emailSettingsMap = new Map<string, boolean>();
  for (const setting of usersSettings) {
    emailSettingsMap.set(setting.user.email, setting.value === 1);
  }
  return emailSettingsMap;
}

function filterEmailsBySettings(
  emails: string[],
  emailSettingsMap: ReturnType<typeof createEmailSettingsMap>,
) {
  return emails.filter((email) => {
    return (
      !emailSettingsMap.has(email) || emailSettingsMap.get(email) !== false
    );
  });
}
