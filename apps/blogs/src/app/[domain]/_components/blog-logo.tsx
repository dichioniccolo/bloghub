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
      className="flex w-64 flex-row items-center"
      aria-label={`${project.name} home page`}
    >
      {project.logo ? (
        <Image src={project.logo} alt={project.name} />
      ) : (
        <Logo alt={project.name} />
      )}
    </Link>
  );
}
