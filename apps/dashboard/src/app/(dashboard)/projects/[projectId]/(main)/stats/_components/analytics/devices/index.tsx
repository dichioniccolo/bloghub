"use client";

import { useMemo, useState } from "react";

import type { AnalyticsDevicesTab } from "@acme/lib/utils";
import { capitalize } from "@acme/lib/utils";
import { Button } from "@acme/ui/components/ui/button";

import { useRouterStuff } from "~/hooks/use-router-stuff";
import { AnalyticsCard } from "../card";

interface Props {
  analytics: {
    devices: { device: string; count: number }[];
    browsers: { browser: string; count: number }[];
    oses: { os: string; count: number }[];
  };
}

export function AnalyticsDevices({
  analytics: { devices, browsers, oses },
}: Props) {
  const [tab, setTab] = useState<AnalyticsDevicesTab>("device");
  const { queryParams } = useRouterStuff();

  const items = useMemo(() => {
    if (tab === "device") {
      return devices.map((x) => ({
        title: capitalize(x.device),
        href: queryParams({
          getNewPath: true,
          set: {
            device: x.device,
          },
        })!,
        count: x.count,
      }));
    } else if (tab === "browser") {
      return browsers.map((x) => ({
        title: x.browser,
        href: queryParams({
          getNewPath: true,
          set: {
            browser: x.browser,
          },
        })!,
        count: x.count,
      }));
    } else if (tab === "os") {
      return oses.map((x) => ({
        title: x.os,
        href: queryParams({
          getNewPath: true,
          set: {
            os: x.os,
          },
        })!,
        count: x.count,
      }));
    }

    return [];
  }, [tab, devices, browsers, oses, queryParams]);

  return (
    <AnalyticsCard
      title="Devices"
      barBackground="bg-green-100 dark:bg-green-900"
      items={items}
      actions={
        <>
          <Button
            className="rounded-md px-2 py-1 text-sm font-medium capitalize transition-all duration-75 active:scale-95 sm:px-3"
            onClick={() => setTab("device")}
          >
            Device
          </Button>
          <Button
            className="rounded-md px-2 py-1 text-sm font-medium capitalize transition-all duration-75 active:scale-95 sm:px-3"
            onClick={() => setTab("browser")}
          >
            Browser
          </Button>
          <Button
            className="rounded-md px-2 py-1 text-sm font-medium capitalize transition-all duration-75 active:scale-95 sm:px-3"
            onClick={() => setTab("os")}
          >
            OS
          </Button>
        </>
      }
    />
  );
}
