import type { ProjectSocialType } from "@acme/db";
import { defaultSocials } from "@acme/lib";
import { Link } from "@acme/ui/components/link";

interface Props {
  socials: {
    social: ProjectSocialType;
    value: string;
  }[];
}

export function BlogSocials({ socials }: Props) {
  return (
    <>
      {socials.map((x) => (
        <Link
          key={x.social}
          href={defaultSocials.find((y) => y.type === x.social)?.url(x) ?? "/"}
          aria-label={`Find me on ${x.social}, external website, opens in a new tab`}
          rel="me noopener"
          target="_blank"
          className="flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150 hover:bg-black/10 dark:hover:bg-white/20"
        >
          {defaultSocials.find((y) => y.type === x.social)?.icon}
        </Link>
      ))}
    </>
  );
}
