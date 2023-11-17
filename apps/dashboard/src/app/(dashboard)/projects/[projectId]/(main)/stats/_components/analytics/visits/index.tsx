"use client";

import { useCallback, useMemo } from "react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";
import { GridRows } from "@visx/grid";
import { scaleBand, scaleLinear } from "@visx/scale";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { BarChart2, X } from "lucide-react";

import { countries } from "@acme/lib";
import type { AnalyticsInterval } from "@acme/lib/utils";
import { ANALYTICS_VALID_STATS_FILTERS, formatNumber } from "@acme/lib/utils";
import { cn } from "@acme/ui";

import { useMediaQuery } from "~/hooks/use-media-query";
import { useRouterStuff } from "~/hooks/use-router-stuff";

interface Props {
  timeseries: {
    createdAt: Date;
    count: number;
  }[];
  filters: {
    interval: AnalyticsInterval;
    country: string | null;
    city: string | null;
    slug: string | null;
    referer: string | null;
    device: string | null;
    browser: string | null;
    os: string | null;
  };
}

interface TooltipData {
  start: Date;
  end: Date;
  count: number;
}

const LEFT_AXIS_WIDTH = 30;
const CHART_MAX_HEIGHT = 400;
const CHART_MAX_WIDTH = 800;

const rangeFormatter = (maxN: number): number => {
  if (maxN < 5) return 5;
  /**
   * Get the max range for a chart based on the maxN value
   */
  return Math.ceil(maxN / 5) * 5;
};

export function AnalyticsVisits({ timeseries, filters }: Props) {
  const validFilters = useMemo(
    () =>
      Object.entries(filters)
        .filter((x) =>
          ANALYTICS_VALID_STATS_FILTERS.map((y) => y.value).includes(x[0]),
        )
        .filter(([, value]) => value !== null),
    [filters],
  );

  const totalVisits = useMemo(
    () => timeseries.reduce((acc, curr) => acc + curr.count, 0),
    [timeseries],
  );

  const { width: screenWidth } = useMediaQuery();

  const [CHART_WIDTH, CHART_HEIGHT] = useMemo(() => {
    const width = screenWidth
      ? Math.min(screenWidth * 0.8, CHART_MAX_WIDTH)
      : CHART_MAX_WIDTH;
    const height = screenWidth
      ? Math.min(screenWidth * 0.5, CHART_MAX_HEIGHT)
      : CHART_MAX_HEIGHT;
    return [width, height];
  }, [screenWidth]);

  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, CHART_WIDTH],
        domain: timeseries.map((x) => x.createdAt),
        padding: 0.4,
      }),
    [CHART_WIDTH, timeseries],
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [CHART_HEIGHT, 0],
        domain: [
          0,
          rangeFormatter(Math.max(...timeseries.map((d) => d.count))),
        ],
        nice: true,
        round: true,
      }),
    [CHART_HEIGHT, timeseries],
  );

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll. consider using
    // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
    scroll: true,
    debounce: 100, // to avoid a weird tooltip flickering bug
  });

  const formatTimestamp = useCallback(
    (e: Date) => {
      switch (filters.interval) {
        case "hour":
          return new Date(e).toLocaleTimeString("en-us", {
            hour: "numeric",
            minute: "numeric",
          });
        case "day":
          return format(e, "dd MMM yyyy");
        case "month":
          return format(e, "MMM yyyy");
        case "year":
          return format(e, "yyyy");
        default:
          return format(e, "yyyy");
      }
    },
    [filters.interval],
  );

  const { queryParams } = useRouterStuff();

  let tooltipTimeout: NodeJS.Timeout | undefined;

  return (
    <div className="max-w-4xl border border-border p-5 sm:rounded-lg sm:p-10 sm:shadow-lg">
      <div className="mb-5 flex items-start justify-between space-x-4">
        <div className="flex-none">
          <div className="flex items-end space-x-1">
            <h1 className="text-3xl font-bold sm:text-4xl">
              {formatNumber(totalVisits)}
            </h1>
            <BarChart2 className="mb-1 h-6 w-6" />
          </div>
          <p className="text-sm font-medium uppercase">Total Visits</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {filters.slug && (
            <button
              onClick={() => {
                queryParams({
                  del: "slug",
                });
              }}
              className="flex items-center space-x-1 rounded-md bg-gray-50 px-2 py-1 text-sm text-gray-500 transition-all duration-75 hover:bg-gray-100 active:scale-[0.98] sm:px-3"
            >
              <p>Post</p>
              <strong className="truncte text-gray-800">{filters.slug}</strong>
              <X className="h-4 w-4" />
            </button>
          )}
          {validFilters.map((x) => {
            const filter =
              ANALYTICS_VALID_STATS_FILTERS.find((y) => y.value === x[0])
                ?.name ?? x[0];

            const value = x[1];

            if (!value) {
              return null;
            }

            return (
              <button
                key={x[0]}
                onClick={() => {
                  queryParams({
                    del: x[0],
                  });
                }}
                className="flex items-center space-x-1 rounded-md bg-gray-50 px-2 py-1 text-sm text-gray-500 transition-all duration-75 hover:bg-gray-100 active:scale-[0.98] sm:px-3"
              >
                <p>{filter}</p>
                <strong className="text-gray-800">
                  {x[0] === "country"
                    ? countries.find((y) => y.code === value)?.name ?? value
                    : value}
                </strong>
                <X className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>
      <figure
        className={cn("my-10 flex", {
          "items-center justify-center": timeseries.length > 0,
        })}
        style={{
          width: CHART_WIDTH,
          height: CHART_HEIGHT,
        }}
      >
        <svg ref={containerRef} width={LEFT_AXIS_WIDTH}>
          <AxisLeft
            hideAxisLine
            hideTicks
            left={8}
            numTicks={4}
            scale={yScale}
            tickFormat={(x) => formatNumber(x as number)}
            tickLabelProps={() => ({
              fill: "#666666",
              fontSize: 14,
              textAnchor: "start",
              transition: "all 0.4s ease-in-out",
            })}
          />
        </svg>
        <svg
          className="overflow-visible"
          height={CHART_HEIGHT}
          width={`calc(100% - ${LEFT_AXIS_WIDTH}px)`}
        >
          <AxisBottom
            hideAxisLine
            hideTicks
            scale={xScale}
            tickFormat={formatTimestamp}
            tickLabelProps={() => ({
              fill: "#666666",
              fontSize: 12,
              textAnchor: "middle",
              transition: "all 0.4s ease-in-out",
            })}
            numTicks={6}
            top={CHART_HEIGHT - 5}
          />
          <GridRows
            numTicks={8}
            scale={yScale}
            width={CHART_WIDTH}
            stroke="#E1E1E1"
          />
          {timeseries.map(({ createdAt, count }, index) => {
            const barWidth = xScale.bandwidth();
            const barHeight = CHART_HEIGHT - yScale(count);
            const barX = xScale(createdAt);
            const barY = CHART_HEIGHT - barHeight;

            return (
              <motion.rect
                key={`bar-${createdAt.toDateString()}`}
                transition={{
                  ease: "easeOut",
                  duration: 0.3,
                }}
                className="!origin-bottom fill-[#2563eb]"
                initial={{
                  transform: "scale(0)",
                }}
                animate={{
                  transform: "scale(1)",
                }}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                onMouseLeave={() => {
                  tooltipTimeout = setTimeout(() => {
                    hideTooltip();
                  }, 300);
                }}
                onMouseMove={(event) => {
                  if (tooltipTimeout) {
                    clearTimeout(tooltipTimeout);
                  }
                  // TooltipInPortal expects coordinates to be relative to containerRef
                  // localPoint returns coordinates relative to the nearest SVG, which
                  // is what containerRef is set to in this example.
                  const eventSvgCoords = localPoint(event) ?? {
                    x: 0,
                    y: 0,
                  };

                  const left = (barX ?? 0) + barWidth / 2 - 81;

                  showTooltip({
                    tooltipData: {
                      start: createdAt,
                      end: timeseries[index + 1]?.createdAt ?? new Date(),
                      count,
                    },
                    tooltipTop: eventSvgCoords.y - 150,
                    tooltipLeft: left,
                  });
                }}
              ></motion.rect>
            );
          })}
        </svg>
        {tooltipOpen && tooltipData && (
          <TooltipInPortal
            top={tooltipTop}
            left={tooltipLeft}
            className="z-40 w-[200px] !rounded-[5px] !p-4 !shadow-[rgba(0,0,0,0.24)_0px_3px_8px] after:absolute after:left-[95%] after:top-full after:m-auto after:h-8 after:w-0 after:border-[7px_solid_transparent] after:border-t-white after:content-['']"
          >
            <div className="text-center">
              <h3 className="my-1 text-black">
                <span className="text-2xl font-semibold">
                  {formatNumber(tooltipData.count)}
                </span>{" "}
                visit{tooltipData.count === 1 ? "" : "s"}
              </h3>
              <p className="text-xs">
                {formatTimestamp(tooltipData.start)} -{" "}
                {formatTimestamp(tooltipData.end)}
              </p>
            </div>
          </TooltipInPortal>
        )}
      </figure>
    </div>
  );
}
