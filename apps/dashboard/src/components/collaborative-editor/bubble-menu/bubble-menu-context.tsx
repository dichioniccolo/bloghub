import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

interface BubbleMenuContextValue {
  isNodeSelectorOpen: boolean;
  setIsNodeSelectorOpen: Dispatch<SetStateAction<boolean>>;
  isLinkSelectorOpen: boolean;
  setIsLinkSelectorOpen: Dispatch<SetStateAction<boolean>>;
  isColorSelectorOpen: boolean;
  setIsColorSelectorOpen: Dispatch<SetStateAction<boolean>>;
  isAiSelectorOpen: boolean;
  setIsAiSelectorOpen: Dispatch<SetStateAction<boolean>>;
  isFixGrammarAndSpellCheckOpen: boolean;
  setIsFixGrammarAndSpellCheckOpen: Dispatch<SetStateAction<boolean>>;
  isSummarizeOpen: boolean;
  setIsSummarizeOpen: Dispatch<SetStateAction<boolean>>;
}

const BubbleMenuContext = createContext<BubbleMenuContextValue>({
  isNodeSelectorOpen: null!,
  setIsNodeSelectorOpen: null!,
  isLinkSelectorOpen: null!,
  setIsLinkSelectorOpen: null!,
  isColorSelectorOpen: null!,
  setIsColorSelectorOpen: null!,
  isAiSelectorOpen: null!,
  setIsAiSelectorOpen: null!,
  isFixGrammarAndSpellCheckOpen: null!,
  setIsFixGrammarAndSpellCheckOpen: null!,
  isSummarizeOpen: null!,
  setIsSummarizeOpen: null!,
});

export function BubbleMenuProvider({ children }: { children: ReactNode }) {
  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);
  const [isAiSelectorOpen, setIsAiSelectorOpen] = useState(false);
  const [isFixGrammarAndSpellCheckOpen, setIsFixGrammarAndSpellCheckOpen] =
    useState(false);
  const [isSummarizeOpen, setIsSummarizeOpen] = useState(false);

  return (
    <BubbleMenuContext.Provider
      value={{
        isNodeSelectorOpen,
        setIsNodeSelectorOpen,
        isLinkSelectorOpen,
        setIsLinkSelectorOpen,
        isColorSelectorOpen,
        setIsColorSelectorOpen,
        isAiSelectorOpen,
        setIsAiSelectorOpen,
        isFixGrammarAndSpellCheckOpen,
        setIsFixGrammarAndSpellCheckOpen,
        isSummarizeOpen,
        setIsSummarizeOpen,
      }}
    >
      {children}
    </BubbleMenuContext.Provider>
  );
}

export function useBubbleMenu() {
  const context = useContext(BubbleMenuContext);

  if (!context) {
    throw new Error("useBubbleMenu must be used within BubbleMenuProvider");
  }

  return context;
}
