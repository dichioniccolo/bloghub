import { forwardRef } from "react";
import * as Popover from "@radix-ui/react-popover";

import { cn } from "@acme/ui";

import { Surface } from "./surface";
import { ToolbarButton } from "./toolbar";

export const Trigger = Popover.Trigger;
export const Portal = Popover.Portal;

export interface MenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  triggerClassName?: string;
  customTrigger?: boolean;
  isOpen?: boolean;
  onOpenChange?: (state: boolean) => void;
  withPortal?: boolean;
  tooltip?: string;
  isActive?: boolean;
}

export const Menu = ({
  customTrigger,
  trigger,
  triggerClassName,
  children,
  isOpen,
  withPortal,
  tooltip,
  onOpenChange,
}: MenuProps) => {
  return (
    <Popover.Root onOpenChange={onOpenChange}>
      {customTrigger ? (
        <Trigger asChild>{trigger}</Trigger>
      ) : (
        <Trigger asChild>
          <ToolbarButton
            className={triggerClassName}
            tooltip={!isOpen ? tooltip : ""}
          >
            {trigger}
          </ToolbarButton>
        </Trigger>
      )}
      {withPortal ? (
        <Popover.Portal>
          <Popover.Content asChild sideOffset={8}>
            <Surface className="z-[9999] flex max-h-80 min-w-[15rem] flex-col gap-0.5 overflow-auto p-2">
              {children}
            </Surface>
          </Popover.Content>
        </Popover.Portal>
      ) : (
        <Popover.Content asChild sideOffset={8}>
          <Surface className="z-[9999] flex max-h-80 min-w-[15rem] flex-col gap-0.5 overflow-auto p-2">
            {children}
          </Surface>
        </Popover.Content>
      )}
    </Popover.Root>
  );
};

Menu.displayName = "Menu";

export const Item = ({
  label,
  close = true,
  iconComponent,
  disabled,
  onClick,
  isActive,
}: {
  label: string | React.ReactNode;
  iconComponent?: React.ReactNode;
  close?: boolean;
  disabled?: boolean;
  onClick: () => void;
  isActive?: boolean;
}) => {
  const className = cn(
    "flex items-center gap-2 p-1.5 text-sm font-medium text-neutral-500 text-left bg-transparent w-full rounded",
    !isActive && !disabled,
    "hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200",
    isActive &&
      !disabled &&
      "bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
    disabled && "text-neutral-400 cursor-not-allowed dark:text-neutral-600",
  );

  const IconCustomComponent = iconComponent ?? null;

  const ItemComponent = close ? Popover.Close : "button";

  return (
    <ItemComponent className={className} onClick={onClick} disabled={disabled}>
      {IconCustomComponent}
      {label}
    </ItemComponent>
  );
};

export interface CategoryTitle {
  children: React.ReactNode;
}

export const CategoryTitle = ({ children }: CategoryTitle) => {
  return (
    <div className="mb-1.5 mt-4 select-none px-1 text-[0.625rem] font-medium uppercase text-neutral-400 first:mt-1.5 dark:text-neutral-600">
      {children}
    </div>
  );
};

export const Divider = forwardRef<HTMLHRElement>((props, ref) => {
  return (
    <hr
      {...props}
      ref={ref}
      className="my-1 border-neutral-200 dark:border-neutral-800"
    />
  );
});

Divider.displayName = "Divider";
