import type { AnalyticsInterval } from "@acme/lib/utils";

import type { GetProjectAnalytics } from "~/app/_api/projects";
import { AnalyticsDevices } from "./devices";
import { AnalyticsLocations } from "./locations";
import { AnalyticsPosts } from "./posts";
import { AnalyticsRefers } from "./referers";
import { AnalyticsVisits } from "./visits";

interface Props {
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
  analytics: GetProjectAnalytics;
}

export function Analytics({
  filters,
  analytics: {
    timeseries,
    cities,
    countries,
    posts,
    referers,
    devices,
    browsers,
    oses,
  },
}: Props) {
  return (
    <div className="py-10">
      <div className="mx-auto grid max-w-4xl gap-5">
        <AnalyticsVisits filters={filters} timeseries={timeseries} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <AnalyticsLocations
            locations={{
              cities,
              countries,
            }}
          />
          <AnalyticsPosts posts={posts} />
          <AnalyticsDevices
            analytics={{
              devices,
              browsers,
              oses,
            }}
          />
          <AnalyticsRefers referers={referers} />
        </div>
      </div>
    </div>
  );
}
