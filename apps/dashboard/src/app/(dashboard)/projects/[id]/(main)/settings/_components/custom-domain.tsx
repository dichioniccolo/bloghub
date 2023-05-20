"use client";

import { useEffect } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  useInterval,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { verifyDomain } from "~/lib/shared/actions/verify-domain";
import { type GetProject } from "~/lib/shared/api/projects";
import { useZact } from "~/lib/zact/client";
import { DomainConfigurations } from "./domain-configurations";
import { UpdateDomainDialog } from "./update-domain-dialog";

type Props = {
  project: NonNullable<GetProject>;
};

export function CustomDomain({ project }: Props) {
  const user = useUser();

  const { isRunning, mutate, data } = useZact(verifyDomain);

  const handleVerify = async () => {
    await mutate({
      projectId: project.id,
      userId: user.id,
    });
  };

  const interval = useInterval(handleVerify, 10000);

  useEffect(() => {
    if (data?.verified) {
      interval.stop();
    }
  }, [data, interval]);

  useEffect(() => {
    void handleVerify();
    interval.start();

    return () => {
      interval.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Domain</CardTitle>
        <CardDescription>
          This is the custom domain associated with your project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:space-x-4">
          <a
            href={`https://${project.domain}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2"
          >
            <p className="flex items-center text-xl font-semibold">
              {project.domain}
            </p>
            <Icons.externalLink className="h-5 w-5" />
          </a>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={async () => {
                await handleVerify();
              }}
              disabled={isRunning || !data}
            >
              {isRunning && (
                <Icons.spinner className="mr-1 h-5 w-5 animate-spin" />
              )}
              Refresh
            </Button>
            <UpdateDomainDialog project={project} />
          </div>
        </div>
        <div className="flex h-10 items-center space-x-2">
          {data ? (
            data.verified ? (
              <>
                <Icons.checkCircle className="h-6 w-6 text-blue-500" />
                <p className="text-sm text-gray-500">Verified</p>
              </>
            ) : data.pending ? (
              <>
                <Icons.alertCircle className="h-6 w-6 text-red-500" />
                <p className="text-sm text-yellow-500">Pending verification</p>
              </>
            ) : (
              <>
                <Icons.alertCircle className="h-6 w-6 text-red-500" />
                <p className="text-sm text-red-500">Invalid configuration</p>
              </>
            )
          ) : (
            <Icons.spinner className="mr-1 h-5 w-5 animate-spin" />
          )}
        </div>
        {data && !data?.verified && <DomainConfigurations status={data} />}
      </CardContent>
    </Card>
  );
}

export function CustomDomainPlaceholder() {
  return (
    <div className="min-w-full rounded-lg border border-gray-200 bg-white py-5 dark:border-gray-700 dark:bg-gray-800 sm:py-10">
      <div className="flex flex-col space-y-3 px-5 sm:px-10">
        <h2 className="text-xl font-medium">Custom Domain</h2>
        <p className="w-80 animate-pulse text-sm text-gray-500">
          This is the custom domain associated with your project.
        </p>
      </div>
      <div className="my-4 border-b border-gray-200 dark:border-gray-700 sm:my-8" />
      <div className="flex flex-col space-y-3 px-5 sm:px-10">
        <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:space-x-4">
          <div className="h-8 w-32 animate-pulse rounded-md bg-gray-200" />
          <div className="flex space-x-3">
            <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
            <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
          </div>
        </div>
        <div className="flex h-10 items-center space-x-2">
          <Icons.spinner className="mr-1 h-5 w-5 animate-spin" />
        </div>
      </div>
    </div>
  );
}
