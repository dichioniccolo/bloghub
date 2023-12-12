import baseSlugify from "slugify";

export * from "./countries";
export * from "./socials";

export function slugify(value: string): string {
  return baseSlugify(value, {
    lower: true,
  });
}

export function generatePostSlug(title: string, id: string): string {
  return `${slugify(title)}-${id}`;
}

export function getPostIdFromSlug(slug: string): string | null {
  const parts = slug.split("-");
  const id = parts[parts.length - 1];
  return id ?? null;
}
