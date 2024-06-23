"use client";

import type { Dispatch, SetStateAction } from "react";
import { HexColorInput } from "react-colorful";

import { AppRoutes } from "@acme/lib/routes";
import { cn } from "@acme/ui";
import { Link } from "@acme/ui/components/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@acme/ui/components/ui/accordion";
import { buttonVariants } from "@acme/ui/components/ui/button";
import { Label } from "@acme/ui/components/ui/label";
import { Switch } from "@acme/ui/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@acme/ui/components/ui/tooltip";

import { env } from "~/env";
import type { QRProps } from "~/lib/qr";

interface AdvancedSettingsProps {
  isOwnerPro: boolean;
  qrData: QRProps;
  setForegroundColor: Dispatch<SetStateAction<string>> | (() => void);
  setShowLogo: Dispatch<SetStateAction<boolean>> | (() => void);
}

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
                  <p className="text-sm text-stone-700 dark:text-stone-300">
                    As a freemium product, we rely on word of mouth to spread
                    the word about {env.NEXT_PUBLIC_APP_NAME}. If you&apos;d
                    like to remove the {env.NEXT_PUBLIC_APP_NAME} logo/upload
                    your own, please consider upgrading to a Pro plan.
                  </p>
                  <Link
                    href={AppRoutes.BillingSettings}
                    className={buttonVariants()}
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
