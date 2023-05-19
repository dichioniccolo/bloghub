"use client";

import { type Dispatch, type SetStateAction } from "react";
import Link from "next/link";

// import { ColorInput, ColorPicker } from "@mantine/core";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Label,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  buttonVariants,
} from "@acme/ui";

import { env } from "~/env.mjs";
import { type QRProps } from "~/lib/qr";
import { cn } from "~/lib/utils";

type AdvancedSettingsProps = {
  isOwnerPro: boolean;
  qrData: QRProps;
  setForegroundColor: Dispatch<SetStateAction<string>> | (() => void);
  setShowLogo: Dispatch<SetStateAction<boolean>> | (() => void);
};

export function AdvancedSettings({
  isOwnerPro,
  qrData,
  setForegroundColor,
  setShowLogo,
}: AdvancedSettingsProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="1">
        <AccordionTrigger className="text-sm text-gray-600">
          Options
        </AccordionTrigger>
        <AccordionContent>
          <div>
            <Label
              htmlFor="logo-toggle"
              className="block text-sm font-medium text-gray-700"
            >
              Logo
            </Label>
            {!isOwnerPro ? (
              <Tooltip>
                <TooltipTrigger>
                  <div className="pointer-events-none mt-1 flex cursor-not-allowed items-center space-x-2 sm:pointer-events-auto">
                    <Switch disabled defaultChecked={true} />
                    <p className="text-sm text-gray-600">
                      Show {env.NEXT_PUBLIC_APP_NAME} Logo
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="flex max-w-sm flex-col gap-4 p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    As a freemium product, we rely on word of mouth to spread
                    the word about {env.NEXT_PUBLIC_APP_NAME}. If you&apos;d
                    like to remove the {env.NEXT_PUBLIC_APP_NAME} logo/upload
                    your own, please consider upgrading to a Pro plan.
                  </p>
                  <Link href="/settings" className={cn(buttonVariants())}>
                    Upgrade to Pro
                  </Link>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="mt-1 flex items-center space-x-2">
                <Switch
                  id="logo"
                  onCheckedChange={setShowLogo}
                  defaultChecked={true}
                />
                <Label htmlFor="logo" className="text-sm text-gray-600">
                  Show {env.NEXT_PUBLIC_APP_NAME} Logo
                </Label>
              </div>
            )}
          </div>
          <div>
            <Label
              htmlFor="color"
              className="block text-sm font-medium text-gray-700"
            >
              Foreground Color
            </Label>
            <div className="relative mt-1 flex h-9 w-48 rounded-md shadow-sm">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="h-full w-12 rounded-l-md border"
                    style={{
                      backgroundColor: qrData.foregroundColor,
                      borderColor: qrData.foregroundColor,
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent align="start">
                  {/* <ColorPicker
                    value={qrData.foregroundColor}
                    format="hex"
                    onChange={(color) => setForegroundColor(color)}
                  /> */}
                </TooltipContent>
              </Tooltip>
              {/* <ColorInput
                id="color"
                name="color"
                value={qrData.foregroundColor}
                onChange={(color) => setForegroundColor(color)}
                style={{ borderColor: qrData.foregroundColor }}
                classNames={{
                  input:
                    "block w-full rounded-l-none rounded-r-md border-2 border-l-0 pl-3 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-black sm:text-sm",
                }}
              /> */}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
