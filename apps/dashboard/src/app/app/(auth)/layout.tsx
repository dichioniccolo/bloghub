import { type PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <div className="min-h-screen">{children}</div>;
}
