import type { ReactNode } from "react";
import { Facebook, Github, Instagram, Linkedin, Youtube } from "lucide-react";

import type { Social } from "@acme/db";

export const defaultSocials = [
  {
    type: "GITHUB",
    name: "GitHub",
    icon: <Github className="h-5 w-5" />,
    url: ({ value }) => `
      https://github.com/${value}
    `,
  },
  {
    type: "TWITTER",
    name: "X",
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
  //   name: "Discord",
  //   icon: (
  //     <svg
  //       className="h-5 w-5 fill-current stroke-current"
  //       xmlns="http://www.w3.org/2000/svg"
  //       preserveAspectRatio="xMidYMid"
  //       viewBox="0 -28.5 256 256"
  //     >
  //       <path
  //         // fill="#5865F2"
  //         d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
  //       />
  //     </svg>
  //   ),
  //   url: ({ value }) => `
  //     https://discord.gg/${value}
  //   `,
  // },
  {
    type: "YOUTUBE",
    name: "YouTube",
    icon: <Youtube className="h-5 w-5" />,
    url: ({ value }) => `
      https://youtube.com/channel/${value}
    `,
  },
  {
    type: "LINKEDIN",
    name: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
    url: ({ value }) => `
      https://linkedin.com/in/${value}
    `,
  },
  {
    type: "FACEBOOK",
    name: "Facebook",
    icon: <Facebook className="h-5 w-5" />,
    url: ({ value }) => `
      https://facebook.com/${value}
    `,
  },
  {
    type: "INSTAGRAM",
    name: "Instagram",
    icon: <Instagram className="h-5 w-5" />,
    url: ({ value }) => `
      https://instagram.com/${value}
    `,
  },
] satisfies {
  type: Social;
  name: string;
  icon: ReactNode;
  url: (x: { value: string }) => string;
}[];
