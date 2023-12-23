"use client";

import { useMemo, useState } from "react";

import { countries } from "@acme/lib";
import type { AnalyticsLocationsTab } from "@acme/lib/utils";
import { Button } from "@acme/ui/components/ui/button";

import { useRouterStuff } from "~/hooks/use-router-stuff";
import { AnalyticsCard } from "../card";

interface Props {
  locations: {
    cities: {
      country: string;
      city: string;
      count: number;
    }[];
    countries: {
      country: string;
      count: number;
    }[];
  };
}

export function AnalyticsLocations({ locations }: Props) {
  const [tab, setTab] = useState<AnalyticsLocationsTab>("country");

  const { queryParams } = useRouterStuff();

  const items = useMemo(() => {
    if (tab === "country") {
      return locations.countries.map((x) => {
        const country = countries.find((y) => y.code === x.country) ?? {
          code: x.country,
          name: x.country,
        };

        return {
          icon: (
            <img
              alt={country.name}
              className="h-3 w-5"
              src={`https://flag.vercel.app/m/${country.code}.svg`}
            />
          ),
          title: country.name,
          href: queryParams({
            getNewPath: true,
            set: {
              country: country.code,
            },
          })!,
          count: x.count,
        };
      });
    } else if (tab === "city") {
      return locations.cities.map((x) => {
        const country = countries.find((y) => y.code === x.country) ?? {
          code: x.country,
          name: x.country,
        };

        return {
          icon: (
            <img
              alt={country.name}
              className="h-3 w-5"
              src={`https://flag.vercel.app/m/${country.code}.svg`}
            />
          ),
          title: x.city,
          href: queryParams({
            getNewPath: true,
            set: {
              city: x.city,
            },
          })!,
          count: x.count,
        };
      });
    }

    return [];
  }, [tab, locations.countries, locations.cities, queryParams]);

  return (
    <AnalyticsCard
      title="Locations"
      barBackground="bg-orange-100 dark:bg-orange-900"
      items={items}
      actions={
        <>
          <Button
            className="rounded-md px-2 py-1 text-sm font-medium capitalize transition-all duration-75 active:scale-95 sm:px-3"
            onClick={() => setTab("country")}
          >
            Country
          </Button>
          <Button
            className="rounded-md px-2 py-1 text-sm font-medium capitalize transition-all duration-75 active:scale-95 sm:px-3"
            onClick={() => setTab("city")}
          >
            City
          </Button>
        </>
      }
    />
  );
}
