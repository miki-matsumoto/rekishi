import { z } from "zod";
import { database } from "src/lib/db";
import { nanoid } from "nanoid";
import { Env } from "src/lib/env";
import { jsonResponse } from "src/lib/response";

const postInput = z.object({
  name: z.string().min(1),
});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const json = await request.json();
  const parsed = postInput.safeParse(json);

  if (!parsed.success)
    return jsonResponse(
      { message: "Bad Request", issues: JSON.parse(parsed.error.message) },
      { status: 400, headers: { "content-type": "application/json" } }
    );

  const { name } = parsed.data;

  const db = database(env.DB);

  const existTarget = await db
    .selectFrom("targets")
    .where("name", "=", name)
    .selectAll()
    .executeTakeFirst();

  // TODO
  if (existTarget) throw new Error("Error.");

  const result = await db
    .insertInto("targets")
    .values({ id: `target_${nanoid()}`, name })
    .returningAll()
    .executeTakeFirst();

  return jsonResponse(result);
};
