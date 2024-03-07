import type { ReactNode } from "react";
import { forwardRef } from "react";

import { cn } from "@acme/ui";

export const DropdownCategoryTitle = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="mb-1 px-1.5 text-[.65rem] font-semibold uppercase text-neutral-500 dark:text-neutral-400">
      {children}
    </div>
  );
};

export const DropdownButton = forwardRef<
  HTMLButtonElement,
  {
    children: ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }
>(({ children, isActive, onClick, disabled, className }, ref) => {
  const buttonClass = cn(
    "flex items-center gap-2 p-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 text-left bg-transparent w-full rounded",
    !isActive && !disabled,
    "hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200",
    isActive &&
      !disabled &&
      "bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
    disabled && "text-neutral-400 cursor-not-allowed dark:text-neutral-600",
    className,
  );

  return (
    <button
      ref={ref}
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

// {
//   children,
//   isActive,
//   onClick,
//   disabled,
//   className,
// }

DropdownButton.displayName = "DropdownButton";
