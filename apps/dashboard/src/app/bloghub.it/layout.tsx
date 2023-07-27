import type { ReactNode } from "react";

import { Footer } from "./_components/footer";
import { MarketingProviders } from "./providers";

type Props = {
  modal: ReactNode;
  children: ReactNode;
};

export default function Layout({ children, modal }: Props) {
  return (
    <MarketingProviders modal={modal}>
      <div className="flex min-h-screen flex-col justify-between">
        {children}
        <Footer />
      </div>
    </MarketingProviders>
  );
}
