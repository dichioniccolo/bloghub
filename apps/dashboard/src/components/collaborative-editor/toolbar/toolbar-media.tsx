import { useRef } from "react";
import type { Editor } from "@tiptap/react";
import { Image } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface Props {
  editor: Editor;
}

export function ToolbarMedia({ editor }: Props) {
  const imageUrlRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button
            type="button"
            variant="ghost"
            disabled={!editor.can().chain().setImage({ src: "" }).run()}
          >
            <Image className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          <label htmlFor="imageUrl">Add image URL</label>
          <Input ref={imageUrlRef} id="imageUrl" />
          <Button
            onClick={() => {
              const value = imageUrlRef.current?.value;

              if (!value) {
                return;
              }

              editor.chain().setImage({ src: value }).run();
            }}
          >
            Add image
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
}
