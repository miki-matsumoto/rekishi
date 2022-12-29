import { z } from "zod";
import { database } from "src/lib/db";
import { nanoid } from "nanoid";

type Env = { DB: D1Database };

const postInput = z.object({
  org_id: z.string().min(1),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
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

  const { org_id, name, avatar } = parsed.data;

  const db = database(env.DB);
  const data = await db
    .insertInto("organizations")
    .values({
      id: `org_${nanoid()}`,
      org_id,
      name,
      avatar,
    })
    .onConflict((oc) => oc.column("org_id").doUpdateSet({ name, avatar }))
    .returning(["org_id", "name", "avatar"])
    .executeTakeFirst();

  // TODO
  if (!data) throw new Error("Failed");

  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
};
