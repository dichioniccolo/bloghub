import { type PropsWithChildren } from "react";

import { getProjectByDomain } from "~/app/_actions/public/projects";
import { BlogFooter } from "~/app/[domain]/_components/blog-footer";
import { BlogHeader } from "~/app/[domain]/_components/blog-header";

type Props = {
  params: {
    domain: string;
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
    <div className="container">
      <BlogHeader project={project} />
      {children}
      <BlogFooter project={project} />
    </div>
  );
}
