import { headers } from "next/headers";
import Image from "next/image";

import { getProjectByDomain } from "~/app/_api/public/projects";
import { env } from "~/env.mjs";
import { TEST_HOSTNAME } from "~/lib/constants";

export default async function NotFound() {
  const hostname = headers()
    .get("host")!
    .replace(".localhost:3000", `.${env.NEXT_PUBLIC_APP_DOMAIN}`);

  const finalHostname =
    env.NODE_ENV === "development" ? TEST_HOSTNAME : hostname;

  const project = await getProjectByDomain(finalHostname);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-cal text-4xl">
        {project ? `${project.name}: ` : ""}404
      </h1>
      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/gray/timed-out-error.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You&apos;ve found a page that doesn&apos;t exist.
      </p>
    </div>
  );
}
