import type { Social } from "@acme/db";
import { defaultSocials } from "@acme/lib";
import { cn } from "@acme/ui";
import { Link } from "@acme/ui/components/link";

interface Props {
  showValue?: boolean;
  socials: {
    social: Social;
    value: string;
  }[];
  className?: string;
}

export function BlogSocials({ showValue = false, socials, className }: Props) {
  return (
    <>
      {socials.map((x) => {
        const defaultSocial = defaultSocials.find((y) => y.type === x.social);

        return (
          <Link
            key={x.social}
            href={defaultSocial?.url(x) ?? "/"}
            aria-label={`Find me on ${
              defaultSocial?.name ?? x.social
            }, external website, opens in a new tab`}
            rel="me noopener"
            target="_blank"
            className={cn(
              "flex flex-row items-center justify-center gap-2 rounded-full p-2 transition-colors duration-150 hover:bg-black/10 dark:hover:bg-white/20",
              className,
            )}
          >
            {defaultSocial?.icon}
            {showValue && <span>{x.value}</span>}
          </Link>
        );
      })}
    </>
  );
}
