import { useOthers, useSelf } from "liveblocks.config";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function Avatars() {
  const users = useOthers();
  const currentUser = useSelf();

  return (
    <div className="flex py-3">
      {users.map(({ connectionId, info }) => (
        <Tooltip key={connectionId}>
          <TooltipTrigger asChild>
            <Avatar className="h-8 w-8">
              {info.image && <AvatarImage src={info.image} />}
              <AvatarFallback>{info.name}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>{info.name}</TooltipContent>
        </Tooltip>
      ))}

      {currentUser && (
        <div className="relative ml-4 first:ml-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8">
                {currentUser.info.image && (
                  <AvatarImage src={currentUser.info.image} />
                )}
                <AvatarFallback>{currentUser.info.name}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{currentUser.info.name}</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
