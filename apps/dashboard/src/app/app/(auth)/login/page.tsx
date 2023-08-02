import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { Skeleton } from "~/components/ui/skeleton";
import { Logo } from "~/app/_components/icons/logo";
import { env } from "~/env.mjs";
import { SignInForm } from "./_components/sign-in-form";

export const dynamic = "force-dynamic";

const title = "Sign in to BlogHub";
const description = "Create your own blog and share your knowledge.";

export const metadata = {
  title,
  description,
} satisfies Metadata;

export default function Page() {
  return (
    <main className="relative m-auto flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-[#fff] to-sky-50 px-2">
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
            <Logo size={50} />
            <span className="mt-2">{env.NEXT_PUBLIC_APP_NAME}</span>
          </h1>
        </Link>
        <p className="mb-6 mt-3 text-center text-sm font-medium text-slate-600">
          Use your email address to securely sign in to your account
        </p>
        <Suspense
          fallback={
            <div className="grid gap-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
      {/* <div className="container flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Logo className="mx-auto h-8 w-8 rounded-full" />
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your email to sign in to your account
          </p>
        </div>
        <Suspense fallback={<UserAuthFormPlaceholder />}>
          <UserAuthForm />
        </Suspense>
      </div>
    </div> */}
    </main>
  );
}
