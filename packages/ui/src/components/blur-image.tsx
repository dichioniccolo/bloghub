"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";

import { cn } from "../lib";

export function BlurImage({ src, alt, className, ...props }: ImageProps) {
  const [loading, setLoading] = useState(true);
  const [realSrc, setRealSrc] = useState(src);

  useEffect(() => {
    setRealSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={realSrc}
      alt={alt}
      className={cn(className, {
        "blur-sm grayscale": loading,
        "blur-0 grayscale-0": !loading,
      })}
      onLoadingComplete={() => setLoading(false)}
    />
  );
}
