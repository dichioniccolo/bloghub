import { JSDOM } from "jsdom";

export function summarize(html: string): { summary: string; hasMore: boolean } {
  const {
    window: { document },
  } = new JSDOM(html);

  const allowedTags = ["p", "ul", "ol", "h3", "pre"];

  let firstElement;

  for (const tag of allowedTags) {
    firstElement = document.body.querySelector(tag);

    if (firstElement) {
      break;
    }
  }

  if (!firstElement) {
    return {
      summary: "",
      hasMore: false,
    };
  }

  if (
    firstElement.textContent &&
    firstElement.textContent.length < 20 &&
    firstElement.nextElementSibling
  ) {
    return {
      summary:
        firstElement.outerHTML + firstElement.nextElementSibling.outerHTML,
      hasMore: document.body.children.length > 2,
    };
  } else {
    return {
      summary: firstElement.outerHTML,
      hasMore: document.body.children.length > 1,
    };
  }
}

export function thumbnail(html: string) {
  const {
    window: { document },
  } = new JSDOM(html);

  const allowedTags = ["img"];

  let firstElement;

  for (const tag of allowedTags) {
    firstElement = document.body.querySelector(tag);

    if (firstElement) {
      break;
    }
  }

  if (!firstElement) {
    return "";
  }

  let htmlString = "";

  if (
    firstElement.textContent &&
    firstElement.textContent.length < 20 &&
    firstElement.nextElementSibling
  ) {
    htmlString = firstElement.nextElementSibling.outerHTML;
  } else {
    htmlString = firstElement.outerHTML;
  }

  const regex = /<[^>]+src="([^"]+)"/g;

  let match: RegExpExecArray | null;
  const matches: string[] = [];

  while ((match = regex.exec(htmlString)) !== null) {
    if (!match[1]) {
      continue;
    }

    matches.push(match[1]);
  }

  if (matches.length === 0) {
    return "";
  }

  return matches[0];
}
