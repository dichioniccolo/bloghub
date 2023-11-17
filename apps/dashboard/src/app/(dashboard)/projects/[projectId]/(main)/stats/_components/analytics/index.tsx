import type { Session } from "@acme/auth";
import type { AnalyticsInterval } from "@acme/lib/utils";

import type { GetProjectAnalytics } from "~/app/_api/projects";
import { AnalyticsDevices } from "./devices";
import { AnalyticsIntervalToggle } from "./interval-toggle";
import { AnalyticsLocations } from "./locations";
import { AnalyticsPosts } from "./posts";
import { AnalyticsRefers } from "./referers";
import { AnalyticsVisits } from "./visits";

interface Props {
  owner: { id: string; isPro: boolean };
  session: Session;
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
  owner,
  session,
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
      <AnalyticsIntervalToggle
        owner={owner}
        session={session}
        interval={filters.interval}
      />
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
