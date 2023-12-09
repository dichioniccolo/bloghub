import type { ImageProps } from "next/image";
import NextImage from "next/image";

import { cn } from "../lib/utils";

export function Image({ fill, className, ...props }: ImageProps) {
  return (
    <span className="relative">
      <NextImage
        fill={fill ?? true}
        className={cn("!relative !w-full object-contain", className)}
        {...props}
      />
    </span>
  );
}
