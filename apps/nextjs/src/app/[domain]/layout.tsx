import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

import { db, eq, projects } from "@acme/db";

import { getProjectByDomain } from "~/app/_api/public/projects";
import { BlogFooter } from "./_components/blog-footer";
import { BlogHeader } from "./_components/blog-header";
import { CustomDomainProviders } from "./providers";

interface Props {
  params: {
    domain: string;
  };
}

export async function generateMetadata({
  params: { domain },
}: Props): Promise<Metadata> {
  const project = await getProjectByDomain(domain);

  if (!project) {
    return {};
  }

  const title = project.name;

  return {
    title,
    openGraph: {
      title,
      images: project.logo ? [project.logo] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: project.logo ? [project.logo] : undefined,
      creator: "@acme",
    },
    icons: project.logo ? [project.logo] : undefined,
    metadataBase: new URL(`https://${domain}`),
  };
}

export async function generateStaticParams() {
  const allProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.domainVerified, true));

  return allProjects.map((project) => ({
    params: {
      domain: project.domain,
    },
  }));
}

export default async function Layout({
  children,
  params: { domain },
}: PropsWithChildren<Props>) {
  const project = await getProjectByDomain(domain);

  if (!project) {
    return null;
  }

  return (
    <CustomDomainProviders>
      <BlogHeader project={project} />
      <div className="mt-20">{children}</div>
      <BlogFooter project={project} />
    </CustomDomainProviders>
  );
}
