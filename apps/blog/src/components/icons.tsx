import { type ReactNode } from "react";
import {
  Infinity as InfinityIcon,
  AlertCircle,
  Check,
  CheckCircle,
  ChevronsUpDown,
  Clipboard,
  Copy,
  Download,
  Edit,
  ExternalLink,
  HelpCircle,
  Image,
  Loader2,
  LogOut,
  Moon,
  MoreHorizontal,
  Plus,
  PlusCircle,
  QrCode,
  Settings,
  Share,
  SunMedium,
  Trash2,
  type Icon as LucideIcon,
} from "lucide-react";

export type Icon = LucideIcon | ReactNode;

export const Icons = {
  add: Plus,
  edit: Edit,
  delete: Trash2,
  moreH: MoreHorizontal,
  share: Share,
  alertCircle: AlertCircle,
  externalLink: ExternalLink,
  checkCircle: CheckCircle,
  sun: SunMedium,
  moon: Moon,
  infinite: InfinityIcon,
  qr: QrCode,
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
} satisfies Record<string, Icon>;
