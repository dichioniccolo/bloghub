import { Image } from "@acme/ui/components/image";
import { Link } from "@acme/ui/components/link";
import { Logo } from "@acme/ui/icons/logo";

interface Props {
  project: {
    name: string;
    logo: string | null;
  };
}

export function BlogLogo({ project }: Props) {
  return (
    <Link
      href="/"
      className="flex w-64 flex-row flex-wrap items-center gap-2 break-normal font-bold"
      aria-label={`${project.name} home page`}
    >
      {project.logo ? (
        <Image className="!h-16 !w-16" src={project.logo} alt={project.name} />
      ) : (
        <Logo alt={project.name} />
      )}

      <span>{project.name}</span>
    </Link>
  );
}
