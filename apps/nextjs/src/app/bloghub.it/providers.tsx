"use client";

import type { ReactNode } from "react";

interface Props {
  modal: ReactNode;
  children: ReactNode;
}

export function MarketingProviders({ modal, children }: Props) {
  // const segment = useSelectedLayoutSegment();

  return (
    <>
      {modal}
      {children}
    </>
  );
}
