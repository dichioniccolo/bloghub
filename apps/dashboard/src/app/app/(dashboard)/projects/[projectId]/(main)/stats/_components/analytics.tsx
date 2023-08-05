"use client";

import Image from "next/image";
import {
  AreaChart,
  BarList,
  Bold,
  Card,
  Flex,
  Grid,
  Text,
  Title,
} from "@tremor/react";

import type { GetProjectAnalytics } from "~/app/_api/projects";
import countries from "~/lib/countries";
import { getMonthByNumber } from "~/lib/utils";

type Props = {
  analytics: GetProjectAnalytics;
};

export function Analytics({
  analytics: { topCities, topCountries, visitsByMonth, topPosts, topReferers },
}: Props) {
  return (
    <div className="grid gap-6">
      <Card>
        <Title>Visits</Title>
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
      </Card>
      <Grid numItems={2} className="gap-6">
        <Card>
          <Title>Top 5 Posts</Title>
          <Flex className="mt-4">
            <Text>
              <Bold>Post</Bold>
            </Text>
            <Text>
              <Bold>Visits</Bold>
            </Text>
          </Flex>
          <BarList
            data={topPosts.map((x) => ({
              name: `/${x.slug}`,
              value: x.count,
            }))}
            className="mt-2"
          />
        </Card>
        <Card>
          <Title>Countries</Title>
          <Flex className="mt-4">
            <Text>
              <Bold>Country</Bold>
            </Text>
            <Text>
              <Bold>Visits</Bold>
            </Text>
          </Flex>
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
            className="mt-2"
          />
        </Card>
        <Card>
          <Title>Cities</Title>
          <Flex className="mt-4">
            <Text>
              <Bold>City</Bold>
            </Text>
            <Text>
              <Bold>Visits</Bold>
            </Text>
          </Flex>
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
            className="mt-2"
          />
        </Card>
        <Card>
          <Title>Referers</Title>
          <Flex className="mt-4">
            <Text>
              <Bold>Referer</Bold>
            </Text>
            <Text>
              <Bold>Visits</Bold>
            </Text>
          </Flex>
          <BarList
            data={topReferers.map((x) => ({
              name: x.referer,
              value: x.count,
            }))}
            className="mt-2"
          />
        </Card>
        {/* {categories.map(({ title, subtitle, data }) => (
          <Card key={title}>
            <Title>{title}</Title>
            <Flex className="mt-4">
              <Text>
                <Bold>{subtitle}</Bold>
              </Text>
              <Text>
                <Bold>Visitors</Bold>
              </Text>
            </Flex>
            <BarList
              data={data.map(({ name, value,  }) => ({
                name,
                value,
                icon: () => {
                  if (title === "Top Referrers") {
                    return (
                      <Image
                        src={`https://www.google.com/s2/favicons?sz=64&domain_url=${name}`}
                        alt={name}
                        className="mr-2.5"
                        width={20}
                        height={20}
                      />
                    );
                  } else if (title === "Countries") {
                    return (
                      <Image
                        src={`https://flag.vercel.app/m/${code}.svg`}
                        className="mr-2.5"
                        alt={code}
                        width={24}
                        height={16}
                      />
                    );
                  } else {
                    return null;
                  }
                },
              }))}
              className="mt-2"
            />
          </Card>
        ))} */}
      </Grid>
    </div>
  );
}
