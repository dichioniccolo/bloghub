import { Separator } from "@acme/ui/components/separator";

import { GeneralSettingsPlaceholder } from "./_components/general-settings";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">General</h2>
        <p className="text-sm text-muted-foreground">
          Configure your project settings.
        </p>
      </div>
      <Separator />
      <GeneralSettingsPlaceholder />
    </div>
  );
}
