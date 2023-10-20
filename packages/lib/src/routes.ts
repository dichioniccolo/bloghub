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
  ProjectAcceptInvitation: (projectId: string) =>
    `/projects/${projectId}/accept`,
  ProjectSettings: (projectId: string) => `/projects/${projectId}/settings`,
  ProjectSettingsMembers: (projectId: string) =>
    `/projects/${projectId}/settings/members`,
  PostEditor: (projectId: string, postId: string) =>
    `/projects/${projectId}/posts/${postId}`,
  PostStats: (projectId: string, postId: string) =>
    `/projects/${projectId}/posts/${postId}/stats`,
};

export const BlogRoutes = {
  Home: `/`,
  Post: (slug: string) => `/posts/${slug}`,
};
