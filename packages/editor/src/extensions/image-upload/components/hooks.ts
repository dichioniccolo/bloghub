import type { DragEvent, ElementRef } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useUploader = ({
  onUpload,
  onUploadComplete,
}: {
  onUpload: (file: File) => Promise<string>;
  onUploadComplete: (url: string) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      setLoading(true);
      try {
        const url = await onUpload(file);

        onUploadComplete(url);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
      setLoading(false);
    },
    [onUpload, onUploadComplete],
  );

  return { loading, uploadFile };
};

export const useFileUpload = () => {
  const fileInput = useRef<ElementRef<"input">>(null);

  const handleUploadClick = useCallback(() => {
    fileInput.current?.click();
  }, []);

  return { ref: fileInput, handleUploadClick };
};

export const useDropZone = ({
  uploader,
}: {
  uploader: (file: File) => Promise<void>;
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedInside, setDraggedInside] = useState<boolean>(false);

  useEffect(() => {
    const dragStartHandler = () => {
      setIsDragging(true);
    };

    const dragEndHandler = () => {
      setIsDragging(false);
    };

    document.body.addEventListener("dragstart", dragStartHandler);
    document.body.addEventListener("dragend", dragEndHandler);

    return () => {
      document.body.removeEventListener("dragstart", dragStartHandler);
      document.body.removeEventListener("dragend", dragEndHandler);
    };
  }, []);

  const onDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>) => {
      setDraggedInside(false);
      if (e.dataTransfer.files.length === 0) {
        return;
      }

      const fileList = e.dataTransfer.files;

      const files: File[] = [];

      for (let i = 0; i < fileList.length; i += 1) {
        const item = fileList.item(i);
        if (item) {
          files.push(item);
        }
      }

      if (files.some((file) => file.type.indexOf("image") === -1)) {
        return;
      }

      e.preventDefault();

      const filteredFiles = files.filter((f) => f.type.indexOf("image") !== -1);

      const file = filteredFiles.length > 0 ? filteredFiles[0] : undefined;

      if (file) {
        await uploader(file);
      }
    },
    [uploader],
  );

  const onDragEnter = () => {
    setDraggedInside(true);
  };

  const onDragLeave = () => {
    setDraggedInside(false);
  };

  return { isDragging, draggedInside, onDragEnter, onDragLeave, onDrop };
};
