import { z } from "zod";
import { database } from "../../../../src/lib/db";

type Env = { DB: D1Database };

const postInput = z.object({
  org_id: z.string().min(1),
  name: z.string().optional(),
});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
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

  const db = database(env.DB);
  // const data = db.insertInto("organization").values({})

  return new Response(JSON.stringify(parsed.data), {
    headers: { "content-type": "application/json" },
  });
};
