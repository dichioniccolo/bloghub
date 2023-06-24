"use client";

import { useState } from "react";

import { cn } from "@acme/ui";

import { type VerifyDomain } from "~/app/_actions/project/verify-domain";
import { env } from "~/env.mjs";
import { getSubDomain } from "~/lib/utils";

type Props = {
  status: VerifyDomain;
};

export const InlineSnippet = ({ children }: { children: string }) => {
  return (
    <span className="inline-block rounded-md bg-blue-100 px-1 py-0.5 font-mono text-blue-900">
      {children}
    </span>
  );
};

export function DomainConfigurations({ status }: Props) {
  const subDomain = getSubDomain(
    status.domainJson?.name,
    status.domainJson?.apexName,
  );
  const [recordType, setRecordType] = useState(subDomain ? "CNAME" : "A");

  if (status.pending && status.domainJson) {
    const txtVerification = status.domainJson.verification?.find(
      (x) => x.type === "TXT",
    );

    return (
      <div className="border-t border-border pt-5">
        <p className="text-sm">
          Please set the following TXT record on{" "}
          <InlineSnippet>{status.domainJson.apexName}</InlineSnippet> to prove
          ownership of <InlineSnippet>{status.domainJson.name}</InlineSnippet>:
        </p>
        <div className="my-5 flex items-start justify-start space-x-10 rounded-md bg-gray-50 p-2 dark:bg-gray-700">
          <div>
            <p className="text-sm font-bold">Type</p>
            <p className="mt-2 font-mono text-sm">{txtVerification?.type}</p>
          </div>
          <div>
            <p className="text-sm font-bold">Name</p>
            <p className="mt-2 font-mono text-sm">
              {txtVerification?.domain.slice(
                0,
                txtVerification.domain.length -
                  status.domainJson.apexName.length -
                  1,
              )}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold">Value</p>
            <p className="mt-2 font-mono text-sm">
              <span className="text-ellipsis">{txtVerification?.value}</span>
            </p>
          </div>
        </div>
        <p className="text-sm">
          Warning: if you are using this domain for another site, setting this
          TXT record will transfer domain ownership away from that site and
          break it. Please exercise caution when setting this record.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-border pt-5">
      <div className="flex justify-start space-x-4">
        <button
          onClick={() => setRecordType("A")}
          className={cn(
            "ease border-b-2 pb-1 text-sm transition-all duration-150",
            {
              "border-border": recordType === "A",
              "border-none text-gray-400": recordType !== "A",
            },
          )}
        >
          A Record{!subDomain && " (recommended)"}
        </button>
        <button
          onClick={() => setRecordType("CNAME")}
          className={cn(
            "ease border-b-2 pb-1 text-sm transition-all duration-150",
            {
              "border-border": recordType === "CNAME",
              "border-none text-gray-400": recordType !== "CNAME",
            },
          )}
        >
          CNAME Record{subDomain && " (recommended)"}
        </button>
      </div>
      <div className="my-3 text-left">
        <p className="my-5 text-sm">
          To configure your {recordType === "A" ? "apex domain" : "subdomain"} (
          <InlineSnippet>
            {recordType === "A"
              ? status.domainJson?.apexName ?? ""
              : status.domainJson?.name ?? ""}
          </InlineSnippet>
          ), set the following {recordType} record on your DNS provider to
          continue:
        </p>
        <div className="flex items-center justify-start space-x-10 rounded-md bg-gray-50 p-2 dark:bg-gray-700">
          <div>
            <p className="text-sm font-bold">Type</p>
            <p className="mt-2 font-mono text-sm">{recordType}</p>
          </div>
          <div>
            <p className="text-sm font-bold">Name</p>
            <p className="mt-2 font-mono text-sm">
              {recordType === "A" ? "@" : subDomain ?? "www"}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold">Value</p>
            <p className="mt-2 font-mono text-sm">
              {recordType === "A"
                ? `76.76.21.21`
                : `cname.${env.NEXT_PUBLIC_APP_DOMAIN ?? "vercel-dns.com"}`}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold">TTL</p>
            <p className="mt-2 font-mono text-sm">86400</p>
          </div>
        </div>
        <p className="mt-5 text-sm">
          Note: for TTL, if <InlineSnippet>86400</InlineSnippet> is not
          available, set the highest value possible. Also, domain propagation
          can take up to an hour.
        </p>
      </div>
    </div>
  );
}
