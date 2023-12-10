import { Separator } from "@acme/ui/components/separator";

import { SocialsPlaceholder } from "./_components/socials";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Socials</h2>
        <p className="text-sm text-muted-foreground">
          Configure your social links.
        </p>
      </div>
      <Separator />
      <SocialsPlaceholder />
    </div>
  );
}
