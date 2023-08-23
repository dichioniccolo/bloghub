import { format } from "date-fns";
import { Copyright } from "lucide-react";

import type { GetProjectByDomain } from "~/app/_api/public/projects";
import { env } from "~/env.mjs";
import { AppLink } from "./app-link";

interface Props {
  project: NonNullable<GetProjectByDomain>;
}

export function BlogFooter({ project }: Props) {
  return (
    <footer className="px-10 py-20">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="flex items-center">
          <p className="flex">
            <Copyright className="mr-2" /> {format(new Date(), "yyyy")}{" "}
            {project.name}
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm">
            Powered by{" "}
            <AppLink variant="link" className="p-0">
              {env.NEXT_PUBLIC_APP_NAME}
            </AppLink>
          </p>
        </div>
      </div>
    </footer>
  );
}
