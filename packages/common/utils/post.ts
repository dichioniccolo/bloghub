import * as cheerio from "cheerio";

export function getPostTitleAndDescriptionByContent(content: string) {
  const $ = cheerio.load(content);

  const h1 = $("h1").first();
  const h2 = $("h2").first();

  return {
    title: h1?.text()?.trim() ?? "",
    description: h2?.text()?.trim() ?? "",
  };
}
