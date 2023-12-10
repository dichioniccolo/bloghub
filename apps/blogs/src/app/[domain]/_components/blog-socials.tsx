import type { ProjectSocialType } from "@acme/db";
import { defaultSocials } from "@acme/lib";
import { cn } from "@acme/ui";
import { Link } from "@acme/ui/components/link";

interface Props {
  showValue?: boolean;
  socials: {
    social: ProjectSocialType;
    value: string;
  }[];
  className?: string;
}

export function BlogSocials({ showValue = false, socials, className }: Props) {
  return (
    <>
      {socials.map((x) => (
        <Link
          key={x.social}
          href={defaultSocials.find((y) => y.type === x.social)?.url(x) ?? "/"}
          aria-label={`Find me on ${x.social}, external website, opens in a new tab`}
          rel="me noopener"
          target="_blank"
          className={cn(
            "flex flex-row items-center justify-center gap-2 rounded-full p-2 transition-colors duration-150 hover:bg-black/10 dark:hover:bg-white/20",
            className,
          )}
        >
          {defaultSocials.find((y) => y.type === x.social)?.icon}
          {showValue && <span>{x.value}</span>}
        </Link>
      ))}
    </>
  );
}
