import { generatePostSlug } from "./utils";

export const AppRoutes = {
  Login: "/login",
  Welcome: "/welcome",
  WelcomeStepCreateProject: "/welcome?step=create-project", // TODO: change with route, not query param
  WelcomeStepDone: "/welcome?step=done", // TODO: change with route, not query param
  Dashboard: "/",
  Settings: "/settings",
  NotificationsSettings: "/settings/notifications",
  BillingSettings: "/settings/billing",
  ProjectDashboard: (projectId: string) => `/projects/${projectId}`,
  ProjectStats: (projectId: string) => `/projects/${projectId}/stats`,
  PostStats: (projectId: string, slug: string) =>
    AppRoutes.ProjectStats(projectId) + `?slug=${slug}`,
  ProjectAcceptInvitation: (projectId: string) =>
    `/projects/${projectId}/accept`,
  ProjectSettings: (projectId: string) => `/projects/${projectId}/settings`,
  ProjectSettingsSocials: (projectId: string) =>
    `/projects/${projectId}/settings/socials`,
  ProjectSettingsMembers: (projectId: string) =>
    `/projects/${projectId}/settings/members`,
  PostEditor: (projectId: string, postId: string) =>
    `/projects/${projectId}/posts/${postId}`,
};

export const BlogRoutes = {
  Home: "/",
  Post: ({ title, id }: { title: string; id: string }) =>
    `/${generatePostSlug(title, id)}`,
};
