import { type ReactNode } from "react";
import {
  AlertCircle,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Archive,
  ArrowLeft,
  BarChart,
  BellRing,
  Bold,
  Check,
  CheckCircle,
  ChevronsUpDown,
  Clipboard,
  Code,
  Copy,
  Download,
  Edit,
  Euro,
  ExternalLink,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  HelpCircle,
  Image,
  Inbox,
  Infinity as InfinityIcon,
  Italic,
  Laptop,
  Link,
  List,
  ListOrdered,
  Loader2,
  LogOut,
  MailPlus,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Pilcrow,
  Plus,
  PlusCircle,
  QrCode,
  Settings,
  Share,
  Strikethrough,
  SunMedium,
  Trash2,
  User,
  type Icon as LucideIcon,
} from "lucide-react";

import { cn } from "~/lib/utils";

export type Icon = LucideIcon | ReactNode;

export const Icons = {
  add: Plus,
  archive: Archive,
  bellRing: BellRing,
  edit: Edit,
  euro: Euro,
  invitation: MailPlus,
  user: User,
  delete: Trash2,
  inbox: Inbox,
  bold: Bold,
  italic: Italic,
  strikeThrough: Strikethrough,
  list: List,
  listOrdered: ListOrdered,
  link: Link,
  laptop: Laptop,
  moreH: MoreHorizontal,
  moreV: MoreVertical,
  share: Share,
  code: Code,
  alertCircle: AlertCircle,
  externalLink: ExternalLink,
  checkCircle: CheckCircle,
  sun: SunMedium,
  moon: Moon,
  infinite: InfinityIcon,
  qr: QrCode,
  chart: BarChart,
  spinner: Loader2,
  chevronsUpDown: ChevronsUpDown,
  check: Check,
  plusCircle: PlusCircle,
  settings: Settings,
  logOut: LogOut,
  helpCircle: HelpCircle,
  copy: Copy,
  clipboard: Clipboard,
  download: Download,
  image: Image,
  arrowLeft: ArrowLeft,
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  paragraph: Pilcrow,
  alignLeft: AlignLeft,
  alignCenter: AlignCenter,
  alignRight: AlignRight,
  alignJustify: AlignJustify,
  divider: ({ className, ...props }) => (
    <svg
      {...props}
      fill="none"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      className={className}
    >
      <path d="M16.88 3.549L7.12 20.451" />
    </svg>
  ),
  logo: ({ className, ...props }) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="500"
      height="500"
      version="1.0"
      viewBox="0 0 375 375"
      className={className}
    >
      <path fill="#fff" d="M-37.5-37.5h450v450h-450z" />
      <path fill="#fff" d="M-37.5-37.5h450v450h-450z" />
      <path fill="#17181a" d="M-37.5-37.5h450v450h-450z" />
      <path
        fill="#fbf7f7"
        d="M90.41 225.375v-40.18c0-18.058 10.078-27.297 21.559-27.297 11.62 0 21.558 9.239 21.558 27.297v40.18h10.5v-40.18c0-18.058 9.942-27.297 21.559-27.297 11.48 0 21.562 9.239 21.562 27.297v40.18h10.497v-38.777c0-24.36-14.137-38.22-32.06-38.22-11.616 0-22.116 6.02-26.737 18.759-4.758-12.739-15.118-18.758-26.88-18.758-17.917 0-32.058 13.86-32.058 38.219v38.777ZM258.96 148.379c-11.758 0-23.098 4.898-29.957 14.7v-41.02h-10.64v64.68c0 23.515 16.66 40.034 39.757 40.034 23.238 0 40.04-16.656 40.04-39.476 0-22.54-16.802-38.918-39.2-38.918Zm-.7 68.738c-16.937 0-29.257-12.18-29.257-29.68s12.18-29.539 29.117-29.539c17.082 0 29.399 12.04 29.399 29.54s-12.18 29.68-29.258 29.68Zm0 0"
      />
    </svg>
  ),
  markdown: ({ className, ...props }) => (
    <svg
      {...props}
      width={26}
      height={16}
      viewBox="0 0 26 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <g clipPath="url(#clip0_33_726)">
        <path
          d="M24.125.625H1.875c-.69 0-1.25.56-1.25 1.25v12.25c0 .69.56 1.25 1.25 1.25h22.25c.69 0 1.25-.56 1.25-1.25V1.875c0-.69-.56-1.25-1.25-1.25z"
          stroke="currentColor"
          strokeWidth={1.29808}
        />
        <path
          d="M3.75 12.25v-8.5h2.5l2.5 3.125 2.5-3.125h2.5v8.5h-2.5V7.375L8.75 10.5l-2.5-3.125v4.875h-2.5zm15.625 0l-3.75-4.125h2.5V3.75h2.5v4.375h2.5l-3.75 4.125z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_33_726">
          <path fill="#fff" d="M0 0H26V16H0z" />
        </clipPath>
      </defs>
    </svg>
  ),
} satisfies Record<string, Icon>;
