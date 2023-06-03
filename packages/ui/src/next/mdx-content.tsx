"use client";

import { type HTMLProps } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

import { BlurImage } from "../components";
import { cn } from "../lib";
import { replaceLinks } from "./mdx-plugins";

type MdxContentProps = {
  source: MDXRemoteSerializeResult;
  className?: string;
};

/** Place your custom MDX components here */
const MdxComponents = {
  a: replaceLinks,
  img: (props: HTMLProps<HTMLImageElement>) => (
    <BlurImage
      {...props}
      src={props.src ?? ""}
      alt={props.alt ?? ""}
      width={1280}
      height={720}
      placeholder="blur"
    />
  ),
  /** h1 colored in yellow */
  // h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
  //   <h1 style={{ color: "#FFF676" }} {...props} />
  // ),
};

export function MdxContent({ source, className }: MdxContentProps) {
  return (
    <article
      className={cn(
        "prose-md prose mx-auto mt-8 border-b pb-6 text-primary sm:prose-lg",
        className,
      )}
      suppressHydrationWarning={true}
    >
      <MDXRemote {...source} components={MdxComponents} />
    </article>
  );
}
