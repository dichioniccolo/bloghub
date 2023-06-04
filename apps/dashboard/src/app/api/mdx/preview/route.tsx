import { serialize } from "next-mdx-remote/serialize";
import rehypeHighlight from "rehype-highlight";

export async function POST(req: Request) {
  const { value } = (await req.json()) as { value?: string };

  if (!value) {
    return new Response(JSON.stringify({ mdxSource: null }), {
      status: 200,
    });
  }

  const mdxSource = await serialize(value, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [rehypeHighlight],
    },
  });

  return new Response(JSON.stringify({ mdxSource }), {
    status: 200,
  });
}
