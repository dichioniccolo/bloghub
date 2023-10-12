import { MultiStepForm } from "./multi-step-form";

interface Props {
  searchParams: {
    step?: string;
    projectId?: string;
  };
}

export default function Welcome({ searchParams }: Props) {
  const step = searchParams.step;
  const projectId = searchParams.projectId;

  return (
    <div className="mx-auto flex h-[calc(100vh-14rem)] w-full max-w-screen-sm flex-col items-center">
      <MultiStepForm step={step} projectId={projectId} />
    </div>
  );
}
