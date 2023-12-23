"use client";

import { Fragment, useMemo, useState } from "react";
import { Calendar, Check, ChevronDown, Lock } from "lucide-react";

import type { Session } from "@acme/auth";
import type { AnalyticsInterval } from "@acme/lib/utils";
import { INTERVALS, PRO_INTERVALS } from "@acme/lib/utils";
import { cn } from "@acme/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@acme/ui/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@acme/ui/components/ui/tooltip";
import { useScroll } from "@acme/ui/hooks/use-scroll";

import { useRouterStuff } from "~/hooks/use-router-stuff";

interface Props {
  session: Session;
  owner: { id: string; isPro: boolean };
  interval: AnalyticsInterval;
}

export function AnalyticsIntervalToggle({ session, owner, interval }: Props) {
  const [open, setOpen] = useState(false);

  const { queryParams } = useRouterStuff();

  const scrolled = useScroll(80);

  const currentInterval = useMemo(
    () =>
      (INTERVALS.find((x) => x.value === interval) ??
        PRO_INTERVALS.find((x) => x.value === interval))!,
    [interval],
  );

  const isCurrentUserOwner = session.user.id === owner.id;

  return (
    <div
      // top-[6.25rem]
      className={cn("sticky top-[4rem] z-10 mb-5 bg-background py-3 md:py-5", {
        "shadow-md": scrolled,
      })}
    >
      <div className="mx-auto flex h-20 max-w-4xl flex-col items-center justify-between space-y-3 px-2.5 md:h-10 md:flex-row md:space-y-0 lg:px-0">
        <div className="flex items-center">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="flex w-full items-center justify-between space-x-2 rounded-md bg-secondary px-3 py-2.5 text-secondary-foreground shadow transition-all duration-75 hover:shadow-md active:scale-95 md:w-48">
              <Calendar className="h-4 w-4" />
              {currentInterval.display}
              <ChevronDown
                className={cn("h-5 w-5 transition-all duration-75", {
                  "rotate-180 transform": open,
                })}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {INTERVALS.map(({ display, value }) => (
                <DropdownMenuItem
                  key={value}
                  onSelect={() =>
                    queryParams({
                      set: {
                        interval: value,
                      },
                    })
                  }
                >
                  <p className="text-sm">{display}</p>
                  <DropdownMenuShortcut className="ml-4">
                    {currentInterval.value === value && (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    )}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              {PRO_INTERVALS.map(({ display, value }) => (
                <Fragment key={value}>
                  {owner.isPro ? (
                    <DropdownMenuItem
                      onSelect={() =>
                        queryParams({
                          set: {
                            interval: value,
                          },
                        })
                      }
                    >
                      <p className="text-sm">{display}</p>
                      <DropdownMenuShortcut className="ml-4">
                        {currentInterval.value === value && (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        )}
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuItem>
                          <p>{display}</p>
                          <DropdownMenuShortcut>
                            <Lock className="h-4 w-4" aria-hidden="true" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm" align="start">
                        {display} stats can only be viewed on a Pro plan or
                        higher.{" "}
                        {isCurrentUserOwner &&
                          "Upgrade now to view all-time stats."}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
