import { format } from "date-fns";

import { env } from "~/env.mjs";
import { type GetProjectByDomain } from "../_actions/projects";
import { AppLink } from "./app-link";
import { Icons } from "./icons";

type Props = {
  project: NonNullable<GetProjectByDomain>;
};

export function BlogFooter({ project }: Props) {
  return (
    <footer className="px-10 py-20">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="flex items-center">
          <p className="flex">
            <Icons.copyright className="mr-2" /> {format(new Date(), "yyyy")}{" "}
            {project.name}&apos; blog
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
