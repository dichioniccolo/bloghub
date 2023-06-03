import { serialize } from "next-mdx-remote/serialize";

export async function POST(req: Request) {
  const { value } = (await req.json()) as { value?: string };

  if (!value) {
    return new Response(JSON.stringify({ mdxSource: null }), {
      status: 200,
    });
  }

  const mdxSource = await serialize(value);

  return new Response(JSON.stringify({ mdxSource }), {
    status: 200,
  });
}
