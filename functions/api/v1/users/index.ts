import { z } from "zod";
import { database } from "src/lib/db";
import { nanoid } from "nanoid";

type Env = { DB: D1Database };

const postValidation = z.object({
  user_id: z.string().min(1),
  org_id: z.string().min(1),
  name: z.string().optional(),
  avatar: z.string().optional(),
});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const json = await request.json();
  const parsed = postValidation.safeParse(json);

  if (!parsed.success)
    return new Response(
      JSON.stringify({
        message: "Bad Request",
        issues: JSON.parse(parsed.error.message),
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );

  const { org_id, name, avatar, user_id } = parsed.data;

  const db = database(env.DB);

  const org = await db
    .selectFrom("organizations")
    .select("id")
    .where("org_id", "=", org_id)
    .executeTakeFirst();

  console.log(org);
  // TODO
  if (!org) throw new Error("Error");

  const data = await db
    .insertInto("users")
    .values({
      id: `user_${nanoid()}`,
      organization_id: org.id,
      user_id,
      avatar,
      name,
    })
    .returning(["user_id", "organization_id", "avatar", "name"])
    .executeTakeFirst();

  // TODO
  if (!data) throw new Error("Failed");

  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
};
