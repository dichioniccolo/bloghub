import { useCopyToClipboard } from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { PostCardButton } from "./post-card-button";

type Props = {
  url: string;
};

export function PostCardCopyButton({ url }: Props) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <PostCardButton onClick={() => copy(url)} className="group">
      <span className="sr-only">Copy</span>
      {copied ? <Icons.check /> : <Icons.copy />}
    </PostCardButton>
  );
}
