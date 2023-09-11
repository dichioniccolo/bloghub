import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";
import type { CursorOverlayData } from "@slate-yjs/react";
import { useRemoteCursorOverlayPositions } from "@slate-yjs/react";

import type { Cursor } from "~/lib/liveblocks/types";

export function Cursors({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursors] = useRemoteCursorOverlayPositions<Cursor>({
    containerRef,
  });

  return (
    <div className="relative" ref={containerRef}>
      {children}
      {cursors.map((cursor) => (
        <Selection key={cursor.clientId} {...cursor} />
      ))}
    </div>
  );
}

function Selection({
  data,
  selectionRects,
  caretPosition,
}: CursorOverlayData<Cursor>) {
  if (!data) {
    return null;
  }

  const selectionStyle: CSSProperties = {
    backgroundColor: data.color,
  };

  return (
    <>
      {selectionRects.map((position, i) => (
        <div
          style={{ ...selectionStyle, ...position }}
          className="pointer-events-none absolute opacity-20"
          key={i}
        />
      ))}
      {caretPosition && <Caret caretPosition={caretPosition} data={data} />}
    </>
  );
}

type CaretProps = Pick<CursorOverlayData<Cursor>, "caretPosition" | "data">;

function Caret({ caretPosition, data }: CaretProps) {
  const caretStyle: CSSProperties = {
    ...caretPosition,
    background: data?.color,
  };

  const labelStyle: CSSProperties = {
    transform: "translateY(-100%)",
    background: data?.color,
  };

  return (
    <div style={caretStyle} className="absolute w-[2px]">
      <div
        className="pointer-events-none absolute top-0 whitespace-nowrap rounded-sm rounded-bl-none px-[2px] py-[6px] text-sm"
        style={labelStyle}
      >
        {data?.name}
      </div>
    </div>
  );
}
