import { useMemo } from "react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import type { icons } from "lucide-react";

import {
  DropdownButton,
  DropdownCategoryTitle,
} from "../../../ui/dropdown-button";
import { Icon } from "../../../ui/icon";
import { Surface } from "../../../ui/surface";
import { ToolbarButton } from "../../../ui/toolbar";

export interface ContentTypePickerOption {
  label: string;
  id: string;
  type: "option";
  disabled: () => boolean;
  isActive: () => boolean;
  onClick: () => void;
  icon: keyof typeof icons;
}

export interface ContentTypePickerCategory {
  label: string;
  id: string;
  type: "category";
}

export type ContentPickerOptions = (
  | ContentTypePickerOption
  | ContentTypePickerCategory
)[];

export interface ContentTypePickerProps {
  options: ContentPickerOptions;
}

const isOption = (
  option: ContentTypePickerOption | ContentTypePickerCategory,
): option is ContentTypePickerOption => option.type === "option";
const isCategory = (
  option: ContentTypePickerOption | ContentTypePickerCategory,
): option is ContentTypePickerCategory => option.type === "category";

export const ContentTypePicker = ({ options }: ContentTypePickerProps) => {
  const activeItem = useMemo(
    () =>
      options.find((option) => option.type === "option" && option.isActive()),
    [options],
  );

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <ToolbarButton
          active={activeItem?.id !== "paragraph" && !!activeItem?.type}
        >
          <Icon
            name={
              (activeItem?.type === "option" && activeItem.icon) || "Pilcrow"
            }
          />
          <Icon name="ChevronDown" className="h-2 w-2" />
        </ToolbarButton>
      </Dropdown.Trigger>
      <Dropdown.Content asChild>
        <Surface className="flex flex-col gap-1 px-2 py-4">
          {options.map((option) => {
            if (isOption(option)) {
              return (
                <DropdownButton
                  key={option.id}
                  onClick={option.onClick}
                  isActive={option.isActive()}
                >
                  <Icon name={option.icon} className="mr-1 h-4 w-4" />
                  {option.label}
                </DropdownButton>
              );
            } else if (isCategory(option)) {
              return (
                <div className="mt-2 first:mt-0" key={option.id}>
                  <DropdownCategoryTitle key={option.id}>
                    {option.label}
                  </DropdownCategoryTitle>
                </div>
              );
            }
          })}
        </Surface>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
