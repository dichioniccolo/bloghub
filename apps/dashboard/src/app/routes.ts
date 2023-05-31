export const Routes = {
  Login: "/login",
  Dashboard: "/",
  Settings: "/settings",
  NotificationsSettings: "/settings/notifications",
  BillingSettings: "/settings/billing",
  ProjectDashboard: (projectId: string) => `/projects/${projectId}`,
  ProjectSettings: (projectId: string) => `/projects/${projectId}/settings`,
  ProjectSettingsMembers: (projectId: string) =>
    `/projects/${projectId}/settings/members`,
  PostEditor: (projectId: string, postId: string) =>
    `/projects/${projectId}/posts/${postId}`,
  PostStats: (projectId: string, postId: string) =>
    `/projects/${projectId}/posts/${postId}/stats`,
};
