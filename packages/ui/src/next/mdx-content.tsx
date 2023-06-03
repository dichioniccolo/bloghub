"use client";

import { type DetailedHTMLProps, type PropsWithoutRef } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

import { BlurImage } from "../components";
import { cn } from "../lib";
import { Mermaid } from "./mdx-components/mermaid";
import { replaceLinks } from "./mdx-plugins";

type MdxContentProps = {
  source: MDXRemoteSerializeResult;
  className?: string;
};

/** Place your custom MDX components here */
const MdxComponents = {
  a: replaceLinks,
  img: (
    props: PropsWithoutRef<
      DetailedHTMLProps<
        React.ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
      >
    >,
  ) => (
    <BlurImage
      {...props}
      src={props.src ?? ""}
      alt={props.alt ?? ""}
      width={1920}
      height={1080}
      placeholder="empty"
    />
  ),
  Mermaid,
  /** h1 colored in yellow */
  // h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
  //   <h1 style={{ color: "#FFF676" }} {...props} />
  // ),
};

export function MdxContent({ source, className }: MdxContentProps) {
  return (
    <article
      className={cn(
        "prose-md dark:prose-dark prose mx-auto mt-8 max-w-none pb-6 text-primary sm:prose-lg",
        className,
      )}
      suppressHydrationWarning={true}
    >
      <MDXRemote {...source} components={MdxComponents} lazy />
    </article>
  );
}
