import { type PropsWithChildren } from "react";

import { BlurImage } from "@acme/ui";

type Props = {
  text: string;
  src: string;
};

export function PlaceholderWithIllustration({
  text,
  src,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-12 dark:border-gray-900 dark:bg-gray-900">
      <h2 className="z-10 text-xl font-semibold text-gray-700 dark:text-gray-300">
        {text}
      </h2>
      <BlurImage
        src={src}
        alt={text}
        width={400}
        height={400}
        className="pointer-events-none -my-8"
        priority
      />
      {children}
    </div>
  );
}
