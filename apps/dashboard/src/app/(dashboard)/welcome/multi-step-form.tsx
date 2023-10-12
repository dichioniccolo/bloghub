"use client";

import { AnimatePresence } from "framer-motion";

import { CreateProject } from "./create-project";
import { Done } from "./done";
import { Intro } from "./intro";

interface Props {
  step?: string;
  projectId?: string;
}

export function MultiStepForm({ step, projectId }: Props) {
  return (
    <AnimatePresence mode="wait">
      {!step && <Intro key="intro" />}
      {step === "create-project" && <CreateProject />}
      {step === "done" && <Done step={step} projectId={projectId} />}
    </AnimatePresence>
  );
}
