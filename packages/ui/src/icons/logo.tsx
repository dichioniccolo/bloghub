import Image from "next/image";

interface Props {
  className?: string;
  size?: number;
  alt: string;
}

export function Logo({ size, className, alt }: Props) {
  return (
    <Image
      src="/_static/logo.png"
      alt={alt}
      width={size ?? 40}
      height={size ?? 40}
      className={className}
    />
  );
}
