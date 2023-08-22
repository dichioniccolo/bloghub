import type { Metadata } from "next";

import { Separator } from "~/components/ui/separator";
import { ProfileForm } from "./_components/profile-form";

export const metadata = {
  title: "Settings",
} satisfies Metadata;

export default function AppDashboardMainSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Profile</h2>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}