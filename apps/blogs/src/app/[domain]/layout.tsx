import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { db, eq, schema } from "@acme/db";

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
  const project = await db.query.projects.findFirst({
    where: eq(schema.projects.domain, domain),
    columns: {
      name: true,
      logo: true,
    },
  });

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
  const allProjects = await db.query.projects.findMany({
    where: (columns, { eq }) => eq(columns.domainVerified, 1),
    columns: {
      domain: true,
    },
  });

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
  const project = await db.query.projects.findFirst({
    where: (columns, { eq }) => eq(columns.domain, domain),
    columns: {
      name: true,
      logo: true,
    },
  });

  if (!project) notFound();

  return (
    <CustomDomainProviders>
      <BlogHeader project={project} />
      <div className="mt-20">{children}</div>
      <BlogFooter project={project} />
    </CustomDomainProviders>
  );
}
