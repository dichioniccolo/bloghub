import { Check, Copy } from "lucide-react";

import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";
import { PostCardButton } from "./post-card-button";

type Props = {
  url: string;
};

export function PostCardCopyButton({ url }: Props) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <PostCardButton onClick={() => copy(url)} className="group">
      <span className="sr-only">Copy</span>
      {copied ? <Check /> : <Copy />}
    </PostCardButton>
  );
}
