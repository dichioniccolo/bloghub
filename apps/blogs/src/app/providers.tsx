"use client";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  // const segment = useSelectedLayoutSegment();

  return <>{children}</>;
}
