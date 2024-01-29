import Link from "next/link";
import { format } from "date-fns";

import { Logo } from "@acme/ui/icons/logo";

import type { GetProjectByDomain } from "~/app/_api/projects";
import { env } from "~/env.mjs";

interface Props {
  project: NonNullable<GetProjectByDomain>;
}

export function BlogFooter({ project }: Props) {
  return (
    <footer className="-mt-px border-t bg-slate-100 px-5 py-10 text-center text-slate-800 dark:border-slate-800 dark:bg-black dark:text-slate-500 md:px-10 md:py-12 lg:py-20">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-12 flex flex-col flex-wrap items-center">
          <p className="mb-2 text-slate-600 dark:text-slate-300">
            ©{format(new Date(), "yyyy")} {project.name}
          </p>
          <div className="flex flex-row flex-wrap items-center justify-center text-slate-600 dark:text-slate-300">
            {/* links */}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Link
            href={`https://app.${env.NEXT_PUBLIC_APP_DOMAIN}?source=footer-${project.id}`}
            target="_blank"
            className="mb-4 flex flex-row items-center rounded-lg border border-slate-300 bg-white p-3 font-bold tracking-wide text-slate-600 transition-colors duration-75 hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:bg-black dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
            aria-label={`Publish with ${env.NEXT_PUBLIC_APP_NAME}`}
          >
            <span className="mr-2 block">
              <Logo alt={env.NEXT_PUBLIC_APP_NAME} className="rounded-full" />
            </span>
            <span>Publish with {env.NEXT_PUBLIC_APP_NAME}</span>
          </Link>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Powered by{" "}
            <Link
              href={`https://app.${env.NEXT_PUBLIC_APP_DOMAIN}?source=footer-${project.id}`}
              target="_blank"
              className="underline"
              aria-label={env.NEXT_PUBLIC_APP_NAME}
            >
              {env.NEXT_PUBLIC_APP_NAME}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
