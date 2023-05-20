import { useState } from "react";

export function useCopyToClipboard({ timeout = 2000 } = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyTimeout, setCopyTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleCopyResult = (value: boolean) => {
    copyTimeout && clearTimeout(copyTimeout);
    setCopyTimeout(setTimeout(() => setCopied(false), timeout));
    setCopied(value);
  };

  const copy = (valueToCopy: string) => {
    if ("clipboard" in navigator) {
      navigator.clipboard
        .writeText(valueToCopy)
        .then(() => handleCopyResult(true))
        .catch((err: Error) => setError(err));
    } else {
      setError(
        new Error("useCopyToClipboard: navigator.clipboard is not supported"),
      );
    }
  };

  const reset = () => {
    setCopied(false);
    setError(null);
    copyTimeout && clearTimeout(copyTimeout);
  };

  return { copy, reset, error, copied };
}
