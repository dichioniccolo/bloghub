import React from "react";
import { Mjml, MjmlBody } from "mjml-react";

import Head from "./Head";

type BaseLayoutProps = {
  width?: number;
  style?: string;
  children: React.ReactNode;
};

export default function BaseLayout({
  width,
  children,
  style,
}: BaseLayoutProps) {
  return (
    <Mjml>
      <Head style={style} />

      <MjmlBody width={width}>{children}</MjmlBody>
    </Mjml>
  );
}
