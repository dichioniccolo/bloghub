import type { ReactNode } from "react";
import { Facebook, Github, Instagram, Linkedin, Youtube } from "lucide-react";

import type { ProjectSocialType } from "@acme/db";

export const defaultSocials = [
  {
    type: "GITHUB",
    icon: <Github className="h-5 w-5" />,
    url: ({ value }) => `
      https://github.com/${value}
    `,
  },
  {
    type: "TWITTER",
    icon: (
      <svg
        className="h-5 w-5 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.643 13.346L4.26862 4.86856C3.85863 4.32329 4.2478 3.54408 4.93001 3.54431L7.2184 3.54508C7.47633 3.54517 7.71945 3.66557 7.87585 3.87066L12.9065 10.4675M10.643 13.346L5.19311 20.5093M10.643 13.346L15.8028 20.077C15.9588 20.2805 16.2003 20.4001 16.4567 20.4009L18.7925 20.4082C19.4778 20.4104 19.8683 19.6261 19.4536 19.0805L12.9065 10.4675M12.9065 10.4675L18.2181 3.50928"
          stroke-width="1.5"
          stroke-linecap="round"
        ></path>
      </svg>
    ),
    url: ({ value }) => `
      https://x.com/${value}
    `,
  },
  // {
  //   type: "DISCORD",
  //   icon: <Discord />,
  // },
  {
    type: "YOUTUBE",
    icon: <Youtube className="h-5 w-5" />,
    url: ({ value }) => `
      https://youtube.com/channel/${value}
    `,
  },
  {
    type: "LINKEDIN",
    icon: <Linkedin className="h-5 w-5" />,
    url: ({ value }) => `
      https://linkedin.com/in/${value}
    `,
  },
  {
    type: "FACEBOOK",
    icon: <Facebook className="h-5 w-5" />,
    url: ({ value }) => `
      https://facebook.com/${value}
    `,
  },
  {
    type: "INSTAGRAM",
    icon: <Instagram className="h-5 w-5" />,
    url: ({ value }) => `
      https://instagram.com/${value}
    `,
  },
] satisfies {
  type: ProjectSocialType;
  icon: ReactNode;
  url: (x: { value: string }) => string;
}[];
