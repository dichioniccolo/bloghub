"use client";

import Image from "next/image";
import { AreaChart, BarList } from "@tremor/react";

import { countries } from "@acme/lib";
import { getMonthByNumber } from "@acme/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";

import type { GetProjectAnalytics } from "~/app/_api/projects";

interface Props {
  analytics: GetProjectAnalytics;
}

export function Analytics({
  analytics: { topCities, topCountries, visitsByMonth, topPosts, topReferers },
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 xl:grid-cols-8">
      <Card className="sm:col-span-4 xl:col-span-8">
        <CardHeader>
          <CardTitle>Visits</CardTitle>
        </CardHeader>
        <CardContent className="pl-0">
          <AreaChart
            className="mt-4 h-72"
            data={visitsByMonth.map((x) => ({
              date: `${getMonthByNumber(x.month, "MMM")} ${x.year}`,
              Visits: x.count,
            }))}
            index="date"
            categories={["Visits"]}
            colors={["indigo"]}
            valueFormatter={(number: number) =>
              Intl.NumberFormat("us").format(number).toString()
            }
          />
        </CardContent>
      </Card>
      <Card className="sm:col-span-2">
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <p className="font-bold">Post</p>
            <p className="font-bold">Visits</p>
          </div>
          <BarList
            data={topPosts.map((x) => ({
              name: x.slug,
              value: x.count,
            }))}
          />
        </CardContent>
      </Card>
      <Card className="sm:col-span-2">
        <CardHeader>
          <CardTitle>Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <p className="font-bold">Country</p>
            <p className="font-bold">Visits</p>
          </div>
          <BarList
            data={topCountries.map((x) => ({
              name:
                countries.find((y) => y.code === x.country)?.name ?? x.country,
              value: x.count,
              icon: () => (
                <Image
                  src={
                    x.country !== "Other"
                      ? `https://flag.vercel.app/m/${x.country}.svg`
                      : "https://avatar.vercel.sh/default"
                  }
                  className="mr-2.5"
                  alt={x.country}
                  width={24}
                  height={16}
                />
              ),
            }))}
          />
        </CardContent>
      </Card>
      <Card className="sm:col-span-2">
        <CardHeader>
          <CardTitle>Cities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <p className="font-bold">City</p>
            <p className="font-bold">Visits</p>
          </div>
          <BarList
            data={topCities.map((x) => ({
              name: x.city,
              value: x.count,
              icon: () => (
                <Image
                  src={
                    x.country !== "Other"
                      ? `https://flag.vercel.app/m/${x.country}.svg`
                      : "https://avatar.vercel.sh/default"
                  }
                  className="mr-2.5"
                  alt={x.country}
                  width={24}
                  height={16}
                />
              ),
            }))}
          />
        </CardContent>
      </Card>
      <Card className="sm:col-span-2">
        <CardHeader>
          <CardTitle>Referers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <p className="font-bold">Referer</p>
            <p className="font-bold">Visits</p>
          </div>

          <BarList
            data={topReferers.map((x) => ({
              name: x.referer,
              value: x.count,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
