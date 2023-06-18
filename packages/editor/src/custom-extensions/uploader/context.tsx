import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { type Editor, type Range } from "@tiptap/core";

type UploaderState = {
  editor: Editor | undefined;
  range: Range | undefined;
  setRange: (range: Range) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const UploaderContext = createContext<UploaderState>({
  editor: undefined,
  range: undefined,
  setRange: () => {
    //
  },
  open: false,
  setOpen: () => {
    //
  },
});

type Props = {
  editor: Editor;
} & PropsWithChildren;

export function UploaderProvider({ editor, children }: Props) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<Range | undefined>(undefined);

  return (
    <UploaderContext.Provider
      value={{
        editor,
        range,
        setRange,
        open,
        setOpen,
      }}
    >
      {children}
    </UploaderContext.Provider>
  );
}

export function useUploader() {
  const context = useContext(UploaderContext);

  if (context === undefined) {
    throw new Error("useUploader must be used within a UploaderProvider");
  }

  return context;
}
