import { Suspense, type PropsWithChildren } from "react";

import { BlogHeader } from "~/app/_components/blog-header";

type Props = {
  params: {
    domain: string;
    slug: string;
  };
};

export default function Layout({
  children,
  params: { domain },
}: PropsWithChildren<Props>) {
  return (
    <div>
      <Suspense fallback={<p>loading</p>}>
        {/* @ts-expect-error react async component */}
        <BlogHeader domain={domain} />
      </Suspense>
      {children}
    </div>
  );
}
