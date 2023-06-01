import { cn } from "../lib";

type HtmlViewProps = {
  html: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

export function HtmlView({ html, className, as = "div" }: HtmlViewProps) {
  const Comp = as;

  return (
    <Comp
      className={cn("prose max-w-none text-primary sm:prose-lg", className)}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
