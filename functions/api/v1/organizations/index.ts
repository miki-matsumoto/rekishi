import { z } from "zod";
import { Database } from "src/lib/db";
import { nanoid } from "nanoid";
import { Env } from "src/lib/env";
import { Kysely } from "kysely";
import { jsonResponse } from "src/lib/response";

const postInput = z.object({
  org_id: z.string().min(1),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const onRequestPost: PagesFunction<
  Env,
  string,
  { db: Kysely<Database> }
> = async ({ request, data }) => {
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

  // const db = database(env.DB);
  const { db } = data;
  const result = await db
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
  if (!result) throw new Error("Failed");

  return jsonResponse(result);
};
