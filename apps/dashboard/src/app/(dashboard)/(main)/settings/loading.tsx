import { Separator } from "@acme/ui/components/separator";
import { Skeleton } from "@acme/ui/components/skeleton";

import { ProfileForm } from "./_components/profile-form";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Profile</h2>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <Skeleton>
        <ProfileForm
          session={{
            expires: "",
            user: {
              id: "",
              sub: "",
              name: "",
              email: "",
              image: "",
              picture: "",
            },
          }}
        />
      </Skeleton>
    </div>
  );
}
