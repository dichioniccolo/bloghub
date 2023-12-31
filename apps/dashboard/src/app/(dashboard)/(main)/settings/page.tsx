import type { Metadata, ServerRuntime } from "next";

import { auth } from "@acme/auth";
import { Separator } from "@acme/ui/components/ui/separator";

import { ProfileForm } from "./_components/profile-form";

export const metadata = {
  title: "Settings",
} satisfies Metadata;

export const runtime: ServerRuntime = "edge";

export default async function AppDashboardMainSettingsPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Profile</h2>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm session={session} />
    </div>
  );
}
