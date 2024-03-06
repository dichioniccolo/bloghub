import { memo } from "react";
import * as Popover from "@radix-ui/react-popover";
import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react";

import { ColorPicker } from "../../panels/colorpicker";
import { Icon } from "../../ui/icon";
import { Surface } from "../../ui/surface";
import {
  ToolbarButton,
  ToolbarDivider,
  ToolbarWrapper,
} from "../../ui/toolbar";
import { ContentTypePicker } from "./components/content-type-picker";
import { EditLinkPopover } from "./components/edit-link-popover";
import { FontSizePicker } from "./components/font-size-picker";
import { useTextmenuCommands } from "./hooks/use-text-menu-commands";
import { useTextmenuContentTypes } from "./hooks/use-text-menu-content-types";
import { useTextmenuStates } from "./hooks/use-text-menu-states";

// We memorize the button so each button is not rerendered
// on every editor state change
const MemoButton = memo(ToolbarButton);
const MemoColorPicker = memo(ColorPicker);
const MemoFontSizePicker = memo(FontSizePicker);
const MemoContentTypePicker = memo(ContentTypePicker);

export interface TextMenuProps {
  editor: Editor;
}

export const TextMenu = ({ editor }: TextMenuProps) => {
  const commands = useTextmenuCommands(editor);
  const states = useTextmenuStates(editor);
  const blockOptions = useTextmenuContentTypes(editor);

  return (
    <BubbleMenu
      tippyOptions={{ popperOptions: { placement: "top-start" } }}
      editor={editor}
      pluginKey="textMenu"
      shouldShow={states.shouldShow}
      updateDelay={100}
    >
      <ToolbarWrapper>
        {/* <AIDropdown
          onCompleteSentence={commands.onCompleteSentence}
          onEmojify={commands.onEmojify}
          onFixSpelling={commands.onFixSpelling}
          onMakeLonger={commands.onMakeLonger}
          onMakeShorter={commands.onMakeShorter}
          onSimplify={commands.onSimplify}
          onTldr={commands.onTldr}
          onTone={commands.onTone}
          onTranslate={commands.onTranslate}
        /> */}
        {/* <ToolbarDivider /> */}
        <MemoContentTypePicker options={blockOptions} />
        {/* <MemoFontFamilyPicker
          onChange={commands.onSetFont}
          value={states.currentFont || ""}
        /> */}
        <MemoFontSizePicker
          onChange={commands.onSetFontSize}
          value={states.currentSize ?? ""}
        />
        <ToolbarDivider />
        <MemoButton
          tooltip="Bold"
          tooltipShortcut={["Mod", "B"]}
          onClick={commands.onBold}
          active={states.isBold}
        >
          <Icon name="Bold" />
        </MemoButton>
        <MemoButton
          tooltip="Italic"
          tooltipShortcut={["Mod", "I"]}
          onClick={commands.onItalic}
          active={states.isItalic}
        >
          <Icon name="Italic" />
        </MemoButton>
        <MemoButton
          tooltip="Underline"
          tooltipShortcut={["Mod", "U"]}
          onClick={commands.onUnderline}
          active={states.isUnderline}
        >
          <Icon name="Underline" />
        </MemoButton>
        <MemoButton
          tooltip="Strikehrough"
          // tooltipShortcut={["Mod", "X"]}
          onClick={commands.onStrike}
          active={states.isStrike}
        >
          <Icon name="Strikethrough" />
        </MemoButton>
        <MemoButton
          tooltip="Code"
          tooltipShortcut={["Mod", "E"]}
          onClick={commands.onCode}
          active={states.isCode}
        >
          <Icon name="Code" />
        </MemoButton>
        <MemoButton tooltip="Code block" onClick={commands.onCodeBlock}>
          <Icon name="Code2" />
        </MemoButton>
        <EditLinkPopover onSetLink={commands.onLink} />
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton
              active={!!states.currentHighlight}
              tooltip="Highlight text"
            >
              <Icon name="Highlighter" />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="bottom" sideOffset={8} asChild>
            <Surface className="p-1">
              <MemoColorPicker
                color={states.currentHighlight}
                onChange={commands.onChangeHighlight}
                onClear={commands.onClearHighlight}
              />
            </Surface>
          </Popover.Content>
        </Popover.Root>
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton active={!!states.currentColor} tooltip="Text color">
              <Icon name="Palette" />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="bottom" sideOffset={8} asChild>
            <Surface className="p-1">
              <MemoColorPicker
                color={states.currentColor}
                onChange={commands.onChangeColor}
                onClear={commands.onClearColor}
              />
            </Surface>
          </Popover.Content>
        </Popover.Root>
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton tooltip="More options">
              <Icon name="MoreVertical" />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="bottom" asChild>
            <ToolbarWrapper>
              <MemoButton
                tooltip="Subscript"
                tooltipShortcut={["Mod", "."]}
                onClick={commands.onSubscript}
                active={states.isSubscript}
              >
                <Icon name="Subscript" />
              </MemoButton>
              <MemoButton
                tooltip="Superscript"
                tooltipShortcut={["Mod", ","]}
                onClick={commands.onSuperscript}
                active={states.isSuperscript}
              >
                <Icon name="Superscript" />
              </MemoButton>
              <ToolbarDivider />
              <MemoButton
                tooltip="Align left"
                tooltipShortcut={["Shift", "Mod", "L"]}
                onClick={commands.onAlignLeft}
                active={states.isAlignLeft}
              >
                <Icon name="AlignLeft" />
              </MemoButton>
              <MemoButton
                tooltip="Align center"
                tooltipShortcut={["Shift", "Mod", "E"]}
                onClick={commands.onAlignCenter}
                active={states.isAlignCenter}
              >
                <Icon name="AlignCenter" />
              </MemoButton>
              <MemoButton
                tooltip="Align right"
                tooltipShortcut={["Shift", "Mod", "R"]}
                onClick={commands.onAlignRight}
                active={states.isAlignRight}
              >
                <Icon name="AlignRight" />
              </MemoButton>
              <MemoButton
                tooltip="Justify"
                tooltipShortcut={["Shift", "Mod", "J"]}
                onClick={commands.onAlignJustify}
                active={states.isAlignJustify}
              >
                <Icon name="AlignJustify" />
              </MemoButton>
            </ToolbarWrapper>
          </Popover.Content>
        </Popover.Root>
      </ToolbarWrapper>
    </BubbleMenu>
  );
};
