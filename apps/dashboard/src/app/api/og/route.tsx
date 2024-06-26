import type { ServerRuntime } from "next";
import { ImageResponse } from "next/og";
import { z } from "zod";

import { Logo } from "@acme/ui/icons/logo";

import { env } from "~/env";

export const runtime: ServerRuntime = "edge";

const ogImageSchema = z.object({
  title: z.string(),
  description: z.string(),
  mode: z.enum(["light", "dark"]).default("dark"),
});

export function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parsedValues = ogImageSchema.parse(
      Object.fromEntries(url.searchParams),
    );

    const { mode, title, description } = parsedValues;
    const paint = mode === "dark" ? "#fff" : "#000";

    return new ImageResponse(
      (
        <div
          // eslint-disable-next-line react/no-unknown-property
          tw="h-full w-full flex items-center justify-center flex-col"
          style={{
            color: paint,
            background:
              mode === "dark"
                ? "linear-gradient(90deg, #000 0%, #111 100%)"
                : "white",
          }}
        >
          <div
            // eslint-disable-next-line react/no-unknown-property
            tw="flex items-center text-3xl justify-center flex-col"
          >
            <Logo alt={env.NEXT_PUBLIC_APP_NAME} size={124} />

            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="124"
              height="124"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"
              />
            </svg> */}
          </div>
          <div
            // eslint-disable-next-line react/no-unknown-property
            tw="flex max-w-4xl items-center justify-center flex-col mt-10"
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            <div
              // eslint-disable-next-line react/no-unknown-property
              tw="text-5xl font-bold tracking-tight leading-tight dark:text-white px-8"
            >
              {title}
            </div>
            <div
              // eslint-disable-next-line react/no-unknown-property
              tw="mt-5 text-3xl text-slate-400 text-center font-normal tracking-tight leading-tight px-20"
            >
              {description}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    error instanceof Error
      ? console.log(`${error.message}`)
      : console.log(error);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
