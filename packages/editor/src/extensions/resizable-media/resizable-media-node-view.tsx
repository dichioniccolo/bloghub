/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { cn } from "@bloghub/ui";
import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight, Trash2 } from "lucide-react";

interface ResizableMediaAction {
  tooltip: string;
  icon?: React.ReactNode;
  action?: (updateAttributes: (o: Record<string, unknown>) => unknown) => void;
  isActive?: (attrs: Record<string, unknown>) => boolean;
  delete?: (d: () => void) => void;
}

export const resizableMediaActions: ResizableMediaAction[] = [
  {
    tooltip: "Align left",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: "start",
      }),
    icon: <AlignLeft />,
    isActive: (attrs) => attrs.dataAlign === "start",
  },
  {
    tooltip: "Align center",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: "center",
      }),
    icon: <AlignCenter />,
    isActive: (attrs) => attrs.dataAlign === "center",
  },
  {
    tooltip: "Align right",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: "end",
      }),
    icon: <AlignRight />,
    isActive: (attrs) => attrs.dataAlign === "end",
  },
  {
    tooltip: "Delete",
    icon: <Trash2 />,
    delete: (deleteNode) => deleteNode(),
  },
];

// ! had to manage this state outside of the component because `useState` isn't fast enough and creates problem cause
// ! the function is getting old data even though new data is set by `useState` before the execution of function
let lastClientX: number;

interface WidthAndHeight {
  width: number;
  height: number;
}

export const ResizableMediaNodeView = ({
  editor,
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) => {
  const editable = editor.options.editable;

  const [aspectRatio, setAspectRatio] = React.useState(0);

  const [proseMirrorContainerWidth, setProseMirrorContainerWidth] =
    React.useState(0);

  const resizableMediaRef = React.useRef<
    HTMLImageElement | HTMLVideoElement | null
  >(null);

  const mediaSetupOnLoad = () => {
    // ! TODO: move this to extension storage
    const proseMirrorContainerDiv = document.querySelector(".ProseMirror");

    if (proseMirrorContainerDiv)
      setProseMirrorContainerWidth(proseMirrorContainerDiv?.clientWidth);

    // When the media has loaded
    if (!resizableMediaRef.current) return;

    if (node.attrs["media-type"] === "video") {
      const video = resizableMediaRef.current as HTMLVideoElement;

      video.addEventListener("loadeddata", function () {
        // Aspect Ratio from its original size
        setAspectRatio(video.videoWidth / video.videoHeight);

        // for the first time when video is added with custom width and height
        // and we have to adjust the video height according to it's width
        onHorizontalResize("left", 0);
      });
    } else {
      resizableMediaRef.current.onload = () => {
        // Aspect Ratio from its original size
        setAspectRatio(
          (resizableMediaRef.current as HTMLImageElement).naturalWidth /
            (resizableMediaRef.current as HTMLImageElement).naturalHeight,
        );
      };
    }
  };

  const setLastClientX = (x: number) => {
    lastClientX = x;
  };

  React.useEffect(() => {
    mediaSetupOnLoad();
  });

  const limitWidthOrHeightToFiftyPixels = ({ width, height }: WidthAndHeight) =>
    width < 100 || height < 100;

  const documentHorizontalMouseMove = (e: MouseEvent) => {
    setTimeout(() => onHorizontalMouseMove(e));
  };

  const startHorizontalResize = (e: { clientX: number }) => {
    lastClientX = e.clientX;

    setTimeout(() => {
      document.addEventListener("mousemove", documentHorizontalMouseMove);
      document.addEventListener("mouseup", stopHorizontalResize);
    });
  };

  const stopHorizontalResize = () => {
    lastClientX = -1;

    document.removeEventListener("mousemove", documentHorizontalMouseMove);
    document.removeEventListener("mouseup", stopHorizontalResize);
  };

  const onHorizontalResize = (
    directionOfMouseMove: "right" | "left",
    diff: number,
  ) => {
    if (!resizableMediaRef.current) {
      console.error("Media ref is undefined|null", {
        resizableImg: resizableMediaRef.current,
      });
      return;
    }

    const currentMediaDimensions = {
      width: resizableMediaRef.current?.width,
      height: resizableMediaRef.current?.height,
    };

    const newMediaDimensions = {
      width: -1,
      height: -1,
    };

    if (directionOfMouseMove === "left") {
      newMediaDimensions.width = currentMediaDimensions.width - Math.abs(diff);
    } else {
      newMediaDimensions.width = currentMediaDimensions.width + Math.abs(diff);
    }

    if (newMediaDimensions.width > proseMirrorContainerWidth)
      newMediaDimensions.width = proseMirrorContainerWidth;

    newMediaDimensions.height = newMediaDimensions.width / aspectRatio;

    if (limitWidthOrHeightToFiftyPixels(newMediaDimensions)) return;

    updateAttributes(newMediaDimensions);
  };

  const onHorizontalMouseMove = (e: MouseEvent) => {
    if (lastClientX === -1) return;

    const { clientX } = e;

    const diff = lastClientX - clientX;

    if (diff === 0) return;

    const directionOfMouseMove: "left" | "right" = diff > 0 ? "left" : "right";

    setTimeout(() => {
      onHorizontalResize(directionOfMouseMove, Math.abs(diff));
      lastClientX = clientX;
    });
  };

  return (
    <NodeViewWrapper
      as="article"
      className={cn(
        "not-prose relative my-2 flex w-full transition-all ease-in-out",
        {
          "justify-center":
            node.attrs.dataAlign === "center" || !node.attrs.dataAlign,
          "justify-start": node.attrs.dataAlign === "start",
          "justify-end": node.attrs.dataAlign === "end",
        },
      )}
    >
      <div className="group relative flex w-fit transition-all ease-in-out">
        {node.attrs["media-type"] === "img" && (
          <img
            ref={resizableMediaRef as any}
            src={node.attrs.src}
            className="rounded-lg"
            alt={node.attrs.src}
            width={node.attrs.width}
            height={node.attrs.height}
          />
        )}

        {node.attrs["media-type"] === "video" && (
          <video
            ref={resizableMediaRef as any}
            className="rounded-lg"
            controls
            width={node.attrs.width}
            height={node.attrs.height}
          >
            <source src={node.attrs.src} />
          </video>
        )}

        {editable && (
          <>
            <div
              className="absolute right-1 top-[50%] z-50 h-24 w-2.5 translate-y-[-50%] cursor-col-resize rounded opacity-50 group-hover:border-2 group-hover:border-white group-hover:bg-black"
              title="Resize"
              onClick={({ clientX }) => setLastClientX(clientX)}
              onMouseDown={startHorizontalResize}
              onMouseUp={stopHorizontalResize}
            />

            <section className="absolute right-2 top-2 box-border hidden overflow-hidden rounded-sm border border-slate-200 bg-white shadow-xl transition-all duration-200 ease-linear group-hover:flex">
              {resizableMediaActions.map((btn) => {
                return (
                  <button
                    key={btn.tooltip}
                    type="button"
                    className={cn(
                      "inline-flex h-8 items-center rounded-none border border-transparent bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-200",
                      {
                        "bg-gray-300": btn.isActive?.(node.attrs),
                      },
                    )}
                    onClick={() =>
                      btn.tooltip === "Delete"
                        ? deleteNode()
                        : btn.action?.(updateAttributes)
                    }
                  >
                    {btn.icon}
                  </button>
                );
              })}
            </section>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};
