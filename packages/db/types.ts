export const EmailNotificationSetting = {
  Communication: 1,
  Marketing: 2,
  Social: 3,
  Security: 4,
} as const;

export type EmailNotificationSettingType =
  (typeof EmailNotificationSetting)[keyof typeof EmailNotificationSetting];

export const Notification = {
  ProjectInvitation: 1,
  RemovedFromProject: 2,
  InvitationAccepted: 3,
} as const;

export type NotificationType = (typeof Notification)[keyof typeof Notification];

export const NotificationStatus = {
  Unread: 1,
  Read: 2,
  Archvied: 3,
} as const;

export type NotificationStatusType =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];

export const Role = {
  Owner: "owner",
  Editor: "editor",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export const MediaEnum = {
  Image: 1,
  Video: 2,
  Audio: 3,
  Document: 4,
} as const;

export type MediaEnumType = (typeof MediaEnum)[keyof typeof MediaEnum];

export const AutomaticEmail = {
  InvalidDomain: 1,
  NearMonthlyLimit: 2,
  MonthlyLimitReached: 3,
} as const;

export type AutomaticEmailType =
  (typeof AutomaticEmail)[keyof typeof AutomaticEmail];

export type VisitBody = {
  browser?: {
    name?: string;
    version?: string;
  };
  os?: {
    name?: string;
    version?: string;
  };
  device?: {
    model?: string;
    type?: string;
    vendor?: string;
  };
  engine?: {
    name?: string;
    version?: string;
  };
  cpu?: {
    architecture?: string;
  };
  geo?: {
    country?: string;
    region?: string;
    city?: string;
    latitute?: string;
    longitude?: string;
  };
};
