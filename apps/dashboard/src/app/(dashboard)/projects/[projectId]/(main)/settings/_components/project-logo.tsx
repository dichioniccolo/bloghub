"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { determineMediaType } from "@acme/lib/utils";
import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { cn } from "@acme/ui";
import { Image } from "@acme/ui/components/image";
import { Button } from "@acme/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/ui/card";

import { createProjectMedia } from "~/app/_actions/project/create-project-media";
import { updateProjectLogo } from "~/app/_actions/project/update-project-logo";
import type { GetProject } from "~/app/_api/projects";

interface Props {
  project: NonNullable<GetProject>;
}

export function ProjectLogo({ project }: Props) {
  const [image, setImage] = useState<string | null>();

  useEffect(() => {
    setImage(project.logo ?? null);
  }, [project.logo]);

  const [dragActive, setDragActive] = useState(false);

  const { action: updateLogo, status: updateLogoStatus } = useServerAction(
    updateProjectLogo,
    {
      onServerError(error) {
        error && toast.error(error);
      },
    },
  );

  const onSubmit = () =>
    updateLogo({
      projectId: project.id,
      logo: image,
    });

  const onChangePicture = useCallback(
    async (file?: File) => {
      if (!file) {
        return;
      }

      if (file.size / 1024 / 1024 > 5) {
        toast.error("File size too big (max 5MB)");
        return;
      } else if (!file.type.includes("image/")) {
        toast.error("File type not supported (image only)");
        return;
      }

      const formData = new FormData();

      formData.append("file", file);
      formData.append("type", determineMediaType(file));
      formData.append("projectId", project.id);
      formData.append("forEntity", "PROJECT_LOGO"); // MediaForEntity.ProjectLogo

      const media = await createProjectMedia(formData);

      if (!media) {
        return;
      }

      setImage(media.url);
    },
    [project.id],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Logo</CardTitle>
        <CardDescription>This is the logo of your project.</CardDescription>
      </CardHeader>
      <CardContent>
        <label
          htmlFor="image"
          className="group relative mt-1 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border border-border bg-white shadow-sm transition-all hover:bg-gray-50 dark:bg-slate-900"
        >
          <div
            className="absolute z-[5] h-full w-full rounded-full"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
              const file = e.dataTransfer.files?.[0];
              void onChangePicture(file);
            }}
          />
          <div
            className={cn(
              "absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-full transition-all",
              {
                "cursor-copy border-2 border-border bg-background opacity-100":
                  dragActive,
                "opacity-0 group-hover:opacity-100": !!image,
                "group-hover:bg-background": !image,
              },
            )}
          >
            <UploadCloud
              className={cn(
                "h-5 w-5 transition-all duration-75 group-hover:scale-110 group-active:scale-95",
                {
                  "scale-110": dragActive,
                  "scale-100": !dragActive,
                },
              )}
            />
          </div>
          {image && (
            <Image
              src={image}
              alt="Preview"
              className="h-full w-full rounded-full object-contain"
            />
          )}
        </label>
        <div className="mt-1 flex rounded-full shadow-sm">
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => onChangePicture(e.target.files?.[0])}
          />
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <Button
          onClick={onSubmit}
          disabled={
            !image ||
            project.logo === image ||
            updateLogoStatus === SubmissionStatus.PENDING
          }
        >
          {updateLogoStatus === SubmissionStatus.PENDING && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save
        </Button>
        <p className="text-sm text-muted-foreground">
          Accepted file types: images. Max file size: 5MB
        </p>
      </CardFooter>
    </Card>
  );
}
