"use client";

import dynamic from "next/dynamic";
import type { Content } from "@tiptap/react";

const Viewer = dynamic(() => import("./viewer").then((x) => x.Viewer), {
  ssr: false,
});

interface Props {
  value: Content;
}

export function ViewerWrapper({ value }: Props) {
  return <Viewer value={value} />;
}
