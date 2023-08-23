"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { Logo } from "~/components/icons/logo";
import { env } from "~/env.mjs";
import { useScroll } from "~/hooks/use-scroll";
import { cn } from "~/lib/cn";
import { subdomainUrl } from "~/lib/url";

export const navItems = [
  {
    name: "Pricing",
    slug: "pricing",
  },
  {
    name: "Features",
    slug: "features",
  },
];

export function Nav() {
  const scrolled = useScroll(80);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <header
      className={cn("sticky inset-x-0 top-0 z-30 w-full transition-all", {
        "bg-white/75 border-b border-border backdrop-blur-lg": scrolled,
      })}
    >
      <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-20">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`https://${env.NEXT_PUBLIC_APP_DOMAIN}`}>
              <Logo />
              {env.NEXT_PUBLIC_APP_NAME}
            </Link>
            <div className="hidden items-center space-x-3 lg:flex">
              {navItems.map((item) => (
                <Link
                  id={`nav-${item.slug}`}
                  key={item.slug}
                  href={`/${item.slug}`}
                  className={cn(
                    "z-10 rounded-full px-4 py-1.5 text-sm font-medium capitalize text-gray-500 transition-colors ease-out hover:text-black",
                    {
                      "text-black": selectedLayout === item.slug,
                    },
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="hidden lg:block">
              <Link
                href={subdomainUrl("app", "/login")}
                className="animate-fade-in rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}