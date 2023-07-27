"use client";

import type { ReactNode } from "react";

type Props = {
  modal: ReactNode;
  children: ReactNode;
};

export function MarketingProviders({ modal, children }: Props) {
  // const segment = useSelectedLayoutSegment();

  return (
    <>
      {modal}
      {children}
    </>
  );
}
