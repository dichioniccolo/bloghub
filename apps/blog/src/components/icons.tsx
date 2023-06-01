import { type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  type Icon as LucideIcon,
} from "lucide-react";

export type Icon = LucideIcon | ReactNode;

export const Icons = {
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
} satisfies Record<string, Icon>;
