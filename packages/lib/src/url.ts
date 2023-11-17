import { env } from "./env.mjs";

export function absoluteUrl(path?: string, withProtocol = true) {
  if (!path) {
    return `${withProtocol ? getProtocol() : ""}${getBaseUrlPath()}`;
  }

  return `${withProtocol ? getProtocol() : ""}${getBaseUrlPath()}${path}`;
}

export function subdomainUrl(
  domain: string,
  path?: string,
  options: { withProtocol?: boolean } = { withProtocol: true },
) {
  if (!path) {
    return `${
      options?.withProtocol ? getProtocol() : ""
    }${domain}.${getBaseUrlPath()}`;
  }

  return `${
    options?.withProtocol ? getProtocol() : ""
  }${domain}.${getBaseUrlPath()}${path}`;
}

export function getProtocol() {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//`;
  }

  return env.NODE_ENV === "production" ? "https://" : "http://";
}

export function getBaseUrlPath() {
  if (typeof window !== "undefined") {
    return window.location.origin.replace(/^https?:\/\//, "");
  }

  if (env.NODE_ENV === "production") {
    return env.NEXT_PUBLIC_APP_DOMAIN;
  }

  return "localhost:3000";
}

export function constructPostUrl(
  domain: string,
  slug: string,
  options: { withProtocol?: boolean; noDomain?: boolean } = {
    withProtocol: true,
    noDomain: false,
  },
) {
  if (options?.noDomain) {
    return `/${slug}`;
  }

  const link = `https://${domain}/${slug}`;

  return options?.withProtocol ? link : link.replace(/^https?:\/\//, "");
}
