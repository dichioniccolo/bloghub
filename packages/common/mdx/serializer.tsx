import { serialize } from "next-mdx-remote/serialize";

import { BlurImage } from "@acme/ui";

import { imageMetadata, replaceLinks } from "./remark-plugins";

const components = {
  a: replaceLinks,
  BlurImage,
  img: (props: any) => <BlurImage {...props} />,
};

export async function serializeMdx(content: string) {
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [imageMetadata],
      remarkPlugins: [],
    },
  });

  return { mdxSource, components };
}
