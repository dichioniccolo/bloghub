import Link from "next/link";

import { Image } from "@acme/ui/components/image";

export default function NotFound() {
  return (
    <div className="flex-1 bg-slate-50 dark:bg-black">
      <div className="container mx-auto flex flex-col px-2 py-20 md:px-4 2xl:px-10">
        <div className="flex w-full flex-row flex-wrap items-center md:flex-nowrap">
          <div className="md:max-w-1/2 relative mb-5 h-64 w-full md:mb-0 md:h-96">
            <Image alt="missing site" src="/_static/404.png" />
          </div>
          <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
            <h2 className="mb-8 text-7xl font-extrabold text-slate-600 dark:text-slate-400">
              404
            </h2>
            <p className="mb-2 text-3xl font-bold text-slate-800 dark:text-slate-100">
              Oops!
            </p>
            <p className="mb-3 text-3xl font-bold text-slate-800 dark:text-slate-100">
              Page not found
            </p>
            <p className="mb-8 text-xl text-slate-600 dark:text-slate-400">
              This page doesn&apos;t exist or was removed!
              <br />
              We suggest you go back home.
            </p>
            <Link
              href="/"
              className="flex flex-row items-center justify-center rounded-full border border-blue-600 px-4 py-2 text-center text-lg font-medium text-blue-600 transition-colors duration-150 hover:bg-blue-50 focus:outline-none disabled:opacity-50 dark:border-blue-500 dark:text-blue-500 hover:dark:bg-slate-800"
            >
              <span>Take me home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
