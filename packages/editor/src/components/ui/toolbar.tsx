import type { ButtonHTMLAttributes, HTMLProps } from "react";
import { forwardRef } from "react";

import { cn } from "@acme/ui";
import type { ButtonProps } from "@acme/ui/components/ui/button";
import { Button } from "@acme/ui/components/ui/button";

import { Surface } from "./surface";
import { Tooltip } from "./tooltip";

export type ToolbarWrapperProps = {
  shouldShowContent?: boolean;
  isVertical?: boolean;
} & HTMLProps<HTMLDivElement>;

export const ToolbarWrapper = forwardRef<HTMLDivElement, ToolbarWrapperProps>(
  (
    {
      shouldShowContent = true,
      children,
      isVertical = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const toolbarClassName = cn(
      "text-black inline-flex h-full leading-none gap-0.5",
      isVertical ? "flex-col p-2" : "flex-row p-1 items-center",
      className,
    );

    return (
      shouldShowContent && (
        <Surface className={toolbarClassName} {...rest} ref={ref}>
          {children}
        </Surface>
      )
    );
  },
);

ToolbarWrapper.displayName = "Toolbar";

export type ToolbarDividerProps = {
  horizontal?: boolean;
} & HTMLProps<HTMLDivElement>;

export const ToolbarDivider = forwardRef<HTMLDivElement, ToolbarDividerProps>(
  ({ horizontal, className, ...rest }, ref) => {
    const dividerClassName = cn(
      "bg-neutral-200 dark:bg-neutral-800",
      horizontal
        ? "w-full min-w-[1.5rem] h-[1px] my-1 first:mt-0 last:mt-0"
        : "h-full min-h-[1.5rem] w-[1px] mx-1 first:ml-0 last:mr-0",
      className,
    );

    return <div className={dividerClassName} ref={ref} {...rest} />;
  },
);

ToolbarDivider.displayName = "Toolbar.Divider";

export type ToolbarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  activeClassname?: string;
  tooltip?: string;
  tooltipShortcut?: string[];
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
};

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      children,
      size = "icon",
      variant = "ghost",
      className,
      tooltip,
      tooltipShortcut,
      active,
      activeClassname,
      type,
      ...rest
    },
    ref,
  ) => {
    const buttonClass = cn(
      "gap-1 min-w-[2rem] px-2 w-auto",
      className,
      active && activeClassname,
    );

    const content = (
      <Button
        className={buttonClass}
        variant={variant}
        size={size}
        ref={ref}
        type={type ?? "button"}
        {...rest}
      >
        {children}
      </Button>
    );

    if (tooltip) {
      return (
        <Tooltip title={tooltip} shortcut={tooltipShortcut}>
          {content}
        </Tooltip>
      );
    }

    return content;
  },
);

ToolbarButton.displayName = "ToolbarButton";
