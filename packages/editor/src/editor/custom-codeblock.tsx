import type { NodeViewProps } from "@tiptap/core";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { createLowlight } from "lowlight";

import { ScrollArea } from "@acme/ui/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/components/ui/select";

const lowlight = createLowlight();

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

export function CodeBlock({
  node,
  updateAttributes,
  extension,
}: NodeViewProps) {
  return (
    <NodeViewWrapper className="relative">
      <Select
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        defaultValue={node.attrs.language}
        onValueChange={(language) => updateAttributes({ language })}
      >
        <SelectTrigger className="absolute right-2 top-2 w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="max-h-[18rem]">
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              <SelectItem value="">auto</SelectItem>
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */}
              {extension.options.lowlight
                .listLanguages()
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                .map((lang: string, index: number) => (
                  <SelectItem key={index} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
            </SelectGroup>
          </ScrollArea>
        </SelectContent>
      </Select>
      <pre>
        <NodeViewContent as="code" className="p-0 text-sm" />
      </pre>
    </NodeViewWrapper>
  );
}

export const CustomCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlock);
  },
}).configure({
  lowlight,
  HTMLAttributes: {
    class: "not-prose",
  },
});
