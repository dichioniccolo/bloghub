import { type ReactNode } from "react";
import { ChevronRight, type Icon as LucideIcon } from "lucide-react";

export type Icon = LucideIcon | ReactNode;

export const Icons = {
  chevronRight: ChevronRight,
} satisfies Record<string, Icon>;
