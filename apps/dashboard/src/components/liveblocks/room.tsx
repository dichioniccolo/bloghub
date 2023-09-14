"use client";

import type { ReactNode } from "react";
import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "liveblocks.config";
import { Loader2 } from "lucide-react";

interface Props {
  children: ReactNode;
  roomId: string;
}

export function Room({ children, roomId }: Props) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense
        fallback={<Loader2 className="h-6 w-6 animate-spin" />}
      >
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
