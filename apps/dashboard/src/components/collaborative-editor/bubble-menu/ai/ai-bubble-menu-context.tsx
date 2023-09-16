import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

interface AiBubbleMenuContextValue {
  isAiSelectorOpen: boolean;
  setIsAiSelectorOpen: Dispatch<SetStateAction<boolean>>;
  isFixGrammarAndSpellCheckOpen: boolean;
  setIsFixGrammarAndSpellCheckOpen: Dispatch<SetStateAction<boolean>>;
}

const AiBubbleMenuContext = createContext<AiBubbleMenuContextValue>({
  isAiSelectorOpen: null!,
  setIsAiSelectorOpen: null!,
  isFixGrammarAndSpellCheckOpen: null!,
  setIsFixGrammarAndSpellCheckOpen: null!,
});

export function AiBubbleMenuProvider({ children }: { children: ReactNode }) {
  const [isAiSelectorOpen, setIsAiSelectorOpen] = useState(false);
  const [isFixGrammarAndSpellCheckOpen, setIsFixGrammarAndSpellCheckOpen] =
    useState(false);

  return (
    <AiBubbleMenuContext.Provider
      value={{
        isAiSelectorOpen,
        setIsAiSelectorOpen,
        isFixGrammarAndSpellCheckOpen,
        setIsFixGrammarAndSpellCheckOpen,
      }}
    >
      {children}
    </AiBubbleMenuContext.Provider>
  );
}

export function useAiBubbleMenu() {
  const context = useContext(AiBubbleMenuContext);

  if (!context) {
    throw new Error("useAiBubbleMenu must be used within AiBubbleMenuProvider");
  }

  return context;
}
