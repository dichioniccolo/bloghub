import { JSDOM } from "jsdom";

export function summarize(html: string): { summary: string; hasMore: boolean } {
  const {
    window: { document },
  } = new JSDOM(html);

  const allowedTags = ["p", "ul", "ol", "h3", "pre", "img"];

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
