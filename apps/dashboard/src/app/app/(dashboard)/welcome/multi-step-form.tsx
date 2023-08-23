"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import { CreateProject } from "./create-project";
import { Done } from "./done";
import { Intro } from "./intro";

export function MultiStepForm() {
  const search = useSearchParams();
  const step = search.get("step");

  return (
    <AnimatePresence mode="wait">
      {!step && <Intro key="intro" />}
      {step === "create-project" && <CreateProject />}
      {step === "done" && <Done />}
    </AnimatePresence>
  );
}
