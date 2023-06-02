"use client";

import { type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import { HexColorInput } from "react-colorful";

import { AppRoutes } from "@acme/common/routes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  buttonVariants,
  inputVariants,
  Label,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
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
        <AccordionTrigger className="text-sm">Options</AccordionTrigger>
        <AccordionContent>
          <div className="mb-2">
            <Label htmlFor="logo-toggle" className="block text-sm font-medium">
              Logo
            </Label>
            {!isOwnerPro ? (
              <Tooltip>
                <TooltipTrigger>
                  <div className="pointer-events-none mt-1 flex cursor-not-allowed items-center space-x-2 sm:pointer-events-auto">
                    <Switch id="logo" disabled defaultChecked={true} />
                    <Label htmlFor="logo" className="text-sm">
                      Show {env.NEXT_PUBLIC_APP_NAME} Logo
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="flex max-w-sm flex-col gap-4 p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    As a freemium product, we rely on word of mouth to spread
                    the word about {env.NEXT_PUBLIC_APP_NAME}. If you&apos;d
                    like to remove the {env.NEXT_PUBLIC_APP_NAME} logo/upload
                    your own, please consider upgrading to a Pro plan.
                  </p>
                  <Link
                    href={AppRoutes.BillingSettings}
                    className={cn(buttonVariants())}
                  >
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
                <Label htmlFor="logo" className="text-sm">
                  Show {env.NEXT_PUBLIC_APP_NAME} Logo
                </Label>
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="color" className="block text-sm font-medium">
              Foreground Color
            </Label>
            <div className="relative mt-1 flex h-9 w-48 rounded-md shadow-sm">
              {/* <Tooltip>
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
                  <HexColorPicker
                    color={qrData.foregroundColor}
                    onChange={setForegroundColor}
                  />
                </TooltipContent>
              </Tooltip> */}
              <div
                className="h-full w-12 rounded-l-md border"
                style={{
                  backgroundColor: qrData.foregroundColor,
                  borderColor: qrData.foregroundColor,
                }}
              />
              <HexColorInput
                id="color"
                name="color"
                color={qrData.foregroundColor}
                onChange={setForegroundColor}
                prefixed
                style={{ borderColor: qrData.foregroundColor }}
                className={cn(
                  inputVariants(),
                  "block h-9 w-full rounded-l-none rounded-r-md border-2 border-l-0 pl-3 focus:outline-none focus:ring-black sm:text-sm",
                )}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
