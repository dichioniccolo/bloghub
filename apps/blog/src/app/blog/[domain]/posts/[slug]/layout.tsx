import { type PropsWithChildren } from "react";

import { BlogHeader } from "~/app/_components/blog-header";
import { getProjectByDomain } from "~/app/actions/projects";

type Props = {
  params: {
    domain: string;
    slug: string;
  };
};

export default async function Layout({
  children,
  params: { domain },
}: PropsWithChildren<Props>) {
  const project = await getProjectByDomain(domain);

  if (!project) {
    return null;
  }

  return (
    <div>
      <BlogHeader project={project} />
      {children}
    </div>
  );
}
