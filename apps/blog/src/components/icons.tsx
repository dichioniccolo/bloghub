import { type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Moon,
  SunMedium,
  type Icon as LucideIcon,
} from "lucide-react";

export type Icon = LucideIcon | ReactNode;

export const Icons = {
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  sun: SunMedium,
  moon: Moon,
} satisfies Record<string, Icon>;
