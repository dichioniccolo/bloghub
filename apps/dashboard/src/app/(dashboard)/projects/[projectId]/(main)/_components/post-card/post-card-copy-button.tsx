import { Check, Copy } from "lucide-react";

import { useCopyToClipboard } from "@acme/ui/hooks/use-copy-to-clipboard";

import { PostCardButton } from "./post-card-button";

interface Props {
  url: string;
}

export function PostCardCopyButton({ url }: Props) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <PostCardButton
      onClick={(e) => {
        e.stopPropagation();
        copy(url);
      }}
      className="group"
    >
      <span className="sr-only">Copy</span>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </PostCardButton>
  );
}
