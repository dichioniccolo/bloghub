import { type PropsWithChildren } from "react";
import Link from "next/link";
import type { Pluggable } from "unified";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

export function replaceLinks(options: { href?: string } & PropsWithChildren) {
  // this is technically not a remark plugin but it
  // replaces internal links with <Link /> component
  // and external links with <a target="_blank" />
  return options.href?.startsWith("/") || options.href === "" ? (
    <Link href={options.href} className="cursor-pointer">
      {options.children}
    </Link>
  ) : (
    <a href={options.href} target="_blank" rel="noopener noreferrer">
      {options.children} ↗
    </a>
  );
}

/**
 * An `<img>` HAST node
 */
interface ImageNode extends Node {
  type: "element";
  tagName: "img";
  properties: {
    src: string;
    height?: number;
    width?: number;
  };
}

/**
 * Determines whether the given HAST node is an `<img>` element.
 */
function isImageNode(node: Node): node is ImageNode {
  const img = node as ImageNode;
  return (
    img.type === "element" &&
    img.tagName === "img" &&
    img.properties &&
    typeof img.properties.src === "string"
  );
}

const SUPPORTED_IMAGE_EXTENSIONS = ["jpg", "png"];

/**
 * Filters out non absolute paths from the public folder.
 */
function filterImageNode(node: ImageNode): boolean {
  return (
    node.properties.src.startsWith("/") &&
    SUPPORTED_IMAGE_EXTENSIONS.some((extension) =>
      node.properties.src.endsWith(`.${extension}`),
    )
  );
}

/**
 * Adds the image's `height` and `width` to it's properties.
 */
// eslint-disable-next-line @typescript-eslint/require-await
async function addMetadata(node: ImageNode): Promise<void> {
  // const { width, height } = await extractMetadata(node.properties.src);

  node.properties.width = 1920;
  node.properties.height = 1080;
}

/**
 * This is a Rehype plugin that finds image `<img>` elements and adds the height and width to the properties.
 * Read more about Next.js image: https://nextjs.org/docs/api-reference/next/image#layout
 */
export const imageMetadata: Pluggable = <T extends Node>() =>
  async function transformer(tree: T): Promise<Node> {
    const imgNodes: ImageNode[] = [];

    visit(tree, "element", (node) => {
      if (isImageNode(node) && filterImageNode(node)) {
        imgNodes.push(node);
      }
    });

    for (const node of imgNodes) {
      await addMetadata(node);
    }

    return tree;
  };
