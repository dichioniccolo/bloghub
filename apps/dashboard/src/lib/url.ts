import { env } from "~/env.mjs";

export function absoluteUrl(path?: string, withProtocol = true) {
  if (!path) {
    return `${withProtocol ? getProtocol() : ""}${getBaseUrlPath()}`;
  }

  return `${withProtocol ? getProtocol() : ""}${getBaseUrlPath()}${path}`;
}

export function subdomainUrl(
  domain: string,
  path?: string,
  options?: { withProtocol?: boolean; forceSubDomain?: boolean },
) {
  if (options?.forceSubDomain) {
    if (!path) {
      return `${
        options?.withProtocol ? getProtocol() : ""
      }${domain}.${getBaseUrlPath()}`;
    }

    return `${
      options?.withProtocol ? getProtocol() : ""
    }${domain}.${getBaseUrlPath()}${path}`;
  }

  return absoluteUrl(`/${domain}${path ? path : ""}`, options?.withProtocol);
}

function getProtocol() {
  if (window !== undefined) {
    return `${window.location.protocol}//`;
  }

  return env.NODE_ENV === "production" ? "https://" : "http://";
}

export function getBaseUrlPath() {
  if (window !== undefined) {
    return window.location.origin.replace(/^https?:\/\//, "");
  }

  if (env.NODE_ENV === "production") {
    return `${process.env.VERCEL_URL}`;
  }

  return `localhost:3000`;
}

export function constructPostUrl(
  domain: string,
  slug: string,
  options?: { withProtocol?: boolean; noDomain?: boolean },
) {
  if (options?.noDomain) {
    return `/${slug}`;
  }

  const link = `https://${domain}/posts/${slug}`;

  return options?.withProtocol ? link : link.replace(/^https?:\/\//, "");
}
