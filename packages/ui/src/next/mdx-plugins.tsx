import { type PropsWithChildren } from "react";
import Link from "next/link";

export function replaceLinks(options: { href?: string } & PropsWithChildren) {
  // this is technically not a remark plugin but it
  // replaces internal links with <Link /> component
  // and external links with <a target="_blank" />
  return options.href?.startsWith("/") || options.href === "" ? (
    <Link href={options.href} className="cursor-pointer text-primary">
      {options.children}
    </Link>
  ) : (
    <a
      href={options.href}
      className="text-primary"
      target="_blank"
      rel="noopener noreferrer"
    >
      {options.children} ↗
    </a>
  );
}
