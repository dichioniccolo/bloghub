"use client";

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

import { type GetProjectAnalytics } from "~/lib/shared/api/projects";
import { getMonthByNumber } from "~/lib/utils";

const chartdata = [
  {
    date: "Jan 23",
    Visitors: 2890,
  },
  {
    date: "Feb 23",
    Visitors: 2756,
  },
  {
    date: "Mar 23",
    Visitors: 3322,
  },
  {
    date: "Apr 23",
    Visitors: 3470,
  },
  {
    date: "May 23",
    Visitors: 3475,
  },
  {
    date: "Jun 23",
    Visitors: 3129,
  },
];

// const referrers = [
//   { name: "t.co", value: 453 },
//   { name: "vercel.com", value: 351 },
//   { name: "linkedin.com", value: 271 },
//   { name: "google.com", value: 191 },
//   {
//     name: "news.ycombinator.com",
//     value: 71,
//   },
// ];

// const countries = [
//   { name: "United States of America", value: 789, code: "US" },
//   { name: "India", value: 676, code: "IN" },
//   { name: "Germany", value: 564, code: "DE" },
//   { name: "United Kingdom", value: 234, code: "GB" },
//   { name: "Spain", value: 191, code: "ES" },
// ];

type Props = {
  analytics: GetProjectAnalytics;
};

export function Analytics({
  analytics: { topCountries, clicksMyMonth, topPosts },
}: Props) {
  // const categories = [
  //   {
  //     title: "Top Pages",
  //     subtitle: "Page",
  //     data: topPosts,
  //   },
  //   {
  //     title: "Top Referrers",
  //     subtitle: "Source",
  //     data: referrers,
  //   },
  //   {
  //     title: "Countries",
  //     subtitle: "Country",
  //     data: countries,
  //   },
  // ] as { title: string; subtitle: string; data: Bar[] }[];

  return (
    <div className="grid gap-6">
      <Card>
        <Title>Clicks</Title>
        <AreaChart
          className="mt-4 h-72"
          data={clicksMyMonth.map((x) => ({
            date: `${getMonthByNumber(x.month, "MMM")} ${x.year}`,
            Clicks: x.count,
          }))}
          index="date"
          categories={["Clicks"]}
          colors={["indigo"]}
          valueFormatter={(number: number) =>
            Intl.NumberFormat("us").format(number).toString()
          }
        />
      </Card>
      <Grid numItemsSm={2} numItemsLg={2} className="gap-6">
        <Card className="max-w-lg">
          <Title>Top 5 Posts</Title>
          <Flex className="mt-4">
            <Text>
              <Bold>Post</Bold>
            </Text>
            <Text>
              <Bold>Clicks</Bold>
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
        <Card className="max-w-lg">
          <Title>Countries</Title>
          <Flex className="mt-4">
            <Text>
              <Bold>Country</Bold>
            </Text>
            <Text>
              <Bold>Clicks</Bold>
            </Text>
          </Flex>
          <BarList
            data={topCountries.map((x) => ({
              name: x.country,
              value: x.count,
            }))}
            className="mt-2"
          />
        </Card>
        {/* {categories.map(({ title, subtitle, data }) => (
          <Card key={title} className="max-w-lg">
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
                      <BlurImage
                        src={`https://www.google.com/s2/favicons?sz=64&domain_url=${name}`}
                        alt={name}
                        className="mr-2.5"
                        width={20}
                        height={20}
                      />
                    );
                  } else if (title === "Countries") {
                    return (
                      <BlurImage
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
