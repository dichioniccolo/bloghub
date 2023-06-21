"use client";

import { forwardRef, useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";

import { cn } from "../lib";

export const BlurImage = forwardRef<HTMLImageElement, ImageProps>(
  function BlurImage({ src, alt, className, ...props }, ref) {
    const [loading, setLoading] = useState(true);
    const [realSrc, setRealSrc] = useState(src);

    useEffect(() => {
      setRealSrc(src);
    }, [src]);

    return (
      <Image
        {...props}
        ref={ref}
        src={realSrc}
        alt={alt}
        className={cn(className, {
          "blur-sm grayscale": loading,
          "blur-0 grayscale-0": !loading,
        })}
        onLoadingComplete={() => setLoading(false)}
      />
    );
  },
);
