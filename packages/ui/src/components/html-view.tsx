import { cn } from "../lib";

type HtmlViewProps = {
  html: string;
  className?: string;
};

export function HtmlView({ html, className }: HtmlViewProps) {
  return (
    <div
      className={cn("prose max-w-none text-primary", className)}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
