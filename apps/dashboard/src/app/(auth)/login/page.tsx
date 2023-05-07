import { Suspense } from "react";

import { Icons } from "~/components/icons";
import { UserAuthForm } from "./UserAuthForm";
import { UserAuthFormPlaceholder } from "./UserAuthFormPlaceholder";

export default function Page() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-8 w-8 rounded-full" />
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your email to sign in to your account
          </p>
        </div>
        <Suspense fallback={<UserAuthFormPlaceholder />}>
          <UserAuthForm />
        </Suspense>
      </div>
    </div>
  );
}
