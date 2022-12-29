import { z } from "zod";

type Env = { DB: D1Database };

const postInput = z.object({
  org_id: z.string().min(1),
  name: z.string().optional(),
});

export const onRequestPost: PagesFunction<Env> = async ({ request }) => {
  const json = await request.json();
  const parsed = postInput.safeParse(json);

  if (!parsed.success)
    return new Response(
      JSON.stringify({
        message: "Bad Request",
        issues: JSON.parse(parsed.error.message),
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );

  return new Response(JSON.stringify(parsed.data), {
    headers: { "content-type": "application/json" },
  });
};
