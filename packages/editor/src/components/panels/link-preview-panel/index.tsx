import { Icon } from "../../ui/icon";
import { Surface } from "../../ui/surface";
import { ToolbarButton, ToolbarDivider } from "../../ui/toolbar";
import { Tooltip } from "../../ui/tooltip";

export interface LinkPreviewPanelProps {
  url: string;
  onEdit: () => void;
  onClear: () => void;
}

export const LinkPreviewPanel = ({
  onClear,
  onEdit,
  url,
}: LinkPreviewPanelProps) => {
  return (
    <Surface className="flex items-center gap-2 p-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline"
      >
        {url}
      </a>
      <ToolbarDivider />
      <Tooltip title="Edit link">
        <ToolbarButton onClick={onEdit}>
          <Icon name="Pen" />
        </ToolbarButton>
      </Tooltip>
      <Tooltip title="Remove link">
        <ToolbarButton onClick={onClear}>
          <Icon name="Trash2" />
        </ToolbarButton>
      </Tooltip>
    </Surface>
  );
};
