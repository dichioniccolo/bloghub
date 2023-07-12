"use client";

import { AlertCircle, CheckCircle, ExternalLink, Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { verifyDomain } from "~/app/_actions/project/verify-domain";
import type { GetProject } from "~/app/_api/projects";
import { useZact } from "~/lib/zact/client";
import { DomainConfigurations } from "./domain-configurations";
import { UpdateDomainDialog } from "./update-domain-dialog";

type Props = {
  project: NonNullable<GetProject>;
};

export function CustomDomain({ project }: Props) {
  const { isRunning, mutate, data } = useZact(verifyDomain);

  const handleVerify = () =>
    mutate({
      projectId: project.id,
    });

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
            <ExternalLink className="h-5 w-5" />
          </a>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={async () => {
                await handleVerify();
              }}
              disabled={isRunning}
            >
              {isRunning && <Loader2 className="mr-1 h-5 w-5 animate-spin" />}
              Verify
            </Button>
            <UpdateDomainDialog project={project} />
          </div>
        </div>
        <div className="flex h-10 items-center space-x-2">
          {(project.domainVerified || data?.verified === true) && (
            <>
              <CheckCircle className="h-6 w-6 text-blue-500" />
              <p className="text-sm text-stone-500">Verified</p>
            </>
          )}

          {data
            ? !data.verified &&
              (data?.pending ? (
                <>
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  <p className="text-sm text-yellow-500">
                    Pending verification
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  <p className="text-sm text-red-500">Invalid configuration</p>
                </>
              ))
            : null}
        </div>
        {data && !data?.verified && <DomainConfigurations status={data} />}
      </CardContent>
    </Card>
  );
}

export function CustomDomainPlaceholder() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <CardTitle>Custom Domain</CardTitle>
        <CardDescription>
          This is the custom domain associated with your project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3 px-5 sm:px-10">
          <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:space-x-4">
            <div className="h-8 w-32 rounded-md bg-stone-200" />
            <div className="flex space-x-3">
              <div className="h-9 w-24 rounded-md bg-stone-200" />
              <div className="h-9 w-24 rounded-md bg-stone-200" />
            </div>
          </div>
          <div className="flex h-10 items-center space-x-2">
            <Loader2 className="mr-1 h-5 w-5 animate-spin" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
