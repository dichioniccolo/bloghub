import { Suspense } from "react";

import { MultiStepForm } from "./multi-step-form";

export default function Welcome() {
  return (
    <div className="mx-auto flex h-[calc(100vh-14rem)] w-full max-w-screen-sm flex-col items-center">
      <Suspense>
        <MultiStepForm />
      </Suspense>
    </div>
  );
}
