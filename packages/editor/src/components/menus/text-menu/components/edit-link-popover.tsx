import * as Popover from "@radix-ui/react-popover";

import { LinkEditorPanel } from "../../../panels/link-editor-panel";
import { Icon } from "../../../ui/icon";
import { ToolbarButton } from "../../../ui/toolbar";

export interface EditLinkPopoverProps {
  onSetLink: (link: string, openInNewTab?: boolean) => void;
}

export const EditLinkPopover = ({ onSetLink }: EditLinkPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <ToolbarButton tooltip="Set Link">
          <Icon name="Link" />
        </ToolbarButton>
      </Popover.Trigger>
      <Popover.Content>
        <LinkEditorPanel onSetLink={onSetLink} />
      </Popover.Content>
    </Popover.Root>
  );
};
