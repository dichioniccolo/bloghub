import Image from "next/image";

import { env } from "~/env.mjs";

type Props = {
  className?: string;
  size?: number;
};

export function Logo({ size, className }: Props) {
  return (
    <Image
      src="/_static/logo.png"
      alt={env.NEXT_PUBLIC_APP_NAME}
      width={size ?? 40}
      height={size ?? 40}
      className={className}
    />
  );
}
