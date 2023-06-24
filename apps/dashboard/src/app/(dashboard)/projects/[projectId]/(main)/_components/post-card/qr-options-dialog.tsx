"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { type GetPosts } from "~/app/_api/posts";
import { type GetProject, type GetProjectOwner } from "~/app/_api/projects";
import { Icons } from "~/app/_components/icons";
import {
  getQRAsCanvas,
  getQrAsString,
  getQRAsSVGDataUri,
  QRCodeSVG,
} from "~/lib/qr";
import { absoluteUrl, constructPostUrl } from "~/lib/url";
import { AdvancedSettings } from "./advanced-settings";

type Props = {
  trigger: ReactNode;
  post: GetPosts[number];
  project: NonNullable<GetProject>;
  owner: GetProjectOwner;
};

export function QrOptionsDialog({ trigger, project, post, owner }: Props) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  const [showLogo, setShowLogo] = useState(true);
  const [foregroundColor, setForegroundColor] = useState("#000000");

  function download(url: string, extension: string) {
    if (!anchorRef.current) return;
    anchorRef.current.href = url;
    anchorRef.current.download = `${post.slug}-qrcode.${extension}`;
    anchorRef.current.click();
  }

  const qrLogoUrl = useMemo(() => {
    if (owner.isPro && project.logo) {
      return project.logo;
    }

    return typeof window !== "undefined" && window.location.origin
      ? new URL("/static/logo.svg", window.location.origin).href
      : "";
  }, [owner.isPro, project.logo]);

  const qrData = useMemo(
    () => ({
      value: constructPostUrl(project.domain, post.slug),
      size: 1024,
      level: "Q",
      backgroundColor: "#FFFFFF",
      foregroundColor,
      ...(showLogo && {
        imageSettings: {
          src: qrLogoUrl,
          height: 256,
          width: 256,
          excavate: true,
        },
      }),
    }),
    [project, post, foregroundColor, qrLogoUrl, showLogo],
  );

  const copyToClipboard = useCallback(async () => {
    try {
      const canvas = await getQRAsCanvas(qrData);

      if (!(canvas instanceof HTMLCanvasElement)) {
        return;
      }

      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error(
            "An error occurred while copying the QR code to the clipboard.",
          );
          return;
        }

        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);

        toast.success("Copied!");
      });
    } catch {
      toast.error(
        "An error occurred while copying the QR code to the clipboard.",
      );
    }
  }, [qrData]);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate QR Code</DialogTitle>
        </DialogHeader>
        <div className="mx-auto rounded-lg border-2 border-border bg-background p-4">
          <QRCodeSVG
            value={qrData.value}
            size={qrData.size / 8}
            backgroundColor={qrData.backgroundColor}
            foregroundColor={qrData.foregroundColor}
            level={qrData.level}
            includeMargin={false}
            imageSettings={
              showLogo && qrData.imageSettings
                ? {
                    ...qrData.imageSettings,
                    height: qrData.imageSettings.height / 8,
                    width: qrData.imageSettings.width / 8,
                  }
                : undefined
            }
          />
        </div>

        <AdvancedSettings
          isOwnerPro={owner.isPro}
          qrData={qrData}
          setForegroundColor={setForegroundColor}
          setShowLogo={setShowLogo}
        />

        <DialogFooter className="gap-1">
          <Button onClick={copyToClipboard}>
            <Icons.clipboard className="mr-2 h-4 w-4" /> Copy
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Icons.download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  download(
                    getQRAsSVGDataUri({
                      ...qrData,
                      ...(showLogo &&
                        qrData.imageSettings && {
                          imageSettings: {
                            ...qrData.imageSettings,
                            src:
                              project.logo || absoluteUrl("/static/logo.svg"),
                          },
                        }),
                    }),
                    "svg",
                  );
                }}
              >
                SVG
                <DropdownMenuShortcut>
                  <Icons.image className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  download(await getQrAsString(qrData, "image/png"), "png");
                }}
              >
                PNG
                <DropdownMenuShortcut>
                  <Icons.image className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={async () => {
                  download(await getQrAsString(qrData, "image/jpeg"), "jpg");
                }}
              >
                JPEG
                <DropdownMenuShortcut>
                  <Icons.image className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogFooter>

        {/* This will be used to prompt downloads. */}
        <a
          className="hidden"
          download={`${post.slug}-qrcode.svg`}
          ref={anchorRef}
        />
      </DialogContent>
    </Dialog>
  );
}
