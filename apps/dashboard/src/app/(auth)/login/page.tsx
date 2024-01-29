import type { Metadata, ServerRuntime } from "next";

import { Logo } from "@acme/ui/icons/logo";
import Link from "next-link";

import { env } from "~/env.mjs";
import { DiscordButton } from "./_components/discord-sign-in";
import { SignInForm } from "./_components/sign-in-form";

const title = "Sign in to BlogHub";
const description = "Create your own blog and share your knowledge.";

export const metadata = {
  title,
  description,
} satisfies Metadata;

export const runtime: ServerRuntime = "edge";

export default function Page() {
  return (
    <main className="relative m-auto flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-50 px-2">
      <div className="absolute inset-x-0 top-[-55px] z-10 h-96 overflow-hidden text-gray-900/40 opacity-10 [mask-image:linear-gradient(to_top,transparent,white)]">
        <svg
          className="absolute inset-0 top-0 h-full w-full text-gray-900"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="pattern"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
              x="50%"
              y="100%"
              patternTransform="translate(0 -1)"
            >
              <path d="M0 32V.5H32" fill="none" stroke="currentColor"></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern)"></rect>
        </svg>
      </div>
      <div className="absolute z-50 m-auto flex w-[380px] flex-1 flex-col justify-center p-6 sm:w-[468px] sm:p-10">
        <Link href="/">
          <h1 className="flex flex-col items-center text-3xl">
            <Logo alt={env.NEXT_PUBLIC_APP_NAME} size={50} />
            <span className="mt-2">{env.NEXT_PUBLIC_APP_NAME}</span>
          </h1>
        </Link>
        <p className="mb-6 mt-3 text-center text-sm font-medium text-slate-600">
          Use your email address to securely sign in to your account
        </p>
        <div className="grid gap-6">
          <SignInForm />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-slate-600">Or</span>
            </div>
          </div>
          <DiscordButton />
        </div>
      </div>
    </main>
  );
}
