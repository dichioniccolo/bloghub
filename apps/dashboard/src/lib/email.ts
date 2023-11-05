import type { EmailNotificationSettingType } from "@acme/db";
import { db } from "@acme/db";
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
    return null;
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
  const usersSettings = await db.emailNotificationSetting.findMany({
    where: {
      type,
      user: {
        email: {
          in: emailAddresses,
        },
      },
    },
    select: {
      value: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  return usersSettings;
}

function createEmailSettingsMap(
  usersSettings: Awaited<ReturnType<typeof fetchEmailNotificationSettings>>,
) {
  const emailSettingsMap = new Map<string, boolean>();
  for (const setting of usersSettings) {
    emailSettingsMap.set(setting.user.email, setting.value);
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
