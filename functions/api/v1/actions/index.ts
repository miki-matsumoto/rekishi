import { z } from "zod";
import { database } from "src/lib/db";
import { nanoid } from "nanoid";
import { Env } from "src/lib/env";
import { jsonResponse } from "src/lib/response";

const postInput = z.object({
  name: z.string().min(1),
  title: z.string().optional(),
  targets: z.array(z.string()).min(1),
});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const json = await request.json();
  const parsed = postInput.safeParse(json);

  if (!parsed.success)
    return jsonResponse(
      { message: "Bad Request", issues: JSON.parse(parsed.error.message) },
      { status: 400, headers: { "content-type": "application/json" } }
    );

  const { name, title, targets: targetNames } = parsed.data;

  const db = database(env.DB);

  const targets = await Promise.all(
    targetNames.map(async (name) => {
      return await db
        .selectFrom("targets")
        .where("name", "=", name)
        .selectAll()
        .executeTakeFirst();
    })
  );

  const nonExistTargets = targetNames.filter(
    (name) => !targets.map((target) => target?.name).includes(name)
  );

  if (nonExistTargets.length)
    return jsonResponse({
      message: `Targets: ${nonExistTargets
        .map((name) => `'${name}'`)
        .join(",")} not found.`,
    });

  // TODO: Error: Transactions are not supported yet. from Kysely D1
  /*
  const result = await db.transaction().execute(async (trx) => {
    const action = await trx
      .insertInto("actions")
      .values({
        id: `action_${nanoid()}`,
        name,
        title,
      })
      .onConflict((oc) => oc.column("name").doUpdateSet({ title }))
      .returningAll()
      .executeTakeFirstOrThrow();

    await Promise.all(
      targets.map(async (target) => {
        return await trx
          .insertInto("targetsOnActions")
          .values({ actionId: action.id, targetId: target?.id ?? "" })
          .returningAll()
          .executeTakeFirstOrThrow();
      })
    );

    return action;
  });
  */
  const action = await db
    .insertInto("actions")
    .values({
      id: `action_${nanoid()}`,
      name,
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .onConflict((oc) => oc.column("name").doUpdateSet({ title }))
    .returningAll()
    .executeTakeFirst();

  if (action)
    await Promise.all(
      targets.map(async (target) => {
        return await db
          .insertInto("targets_on_actions")
          .values({ action_id: action.id, target_id: target?.id ?? "" })
          .onConflict((qb) =>
            qb.columns(["target_id", "action_id"]).doNothing()
          )
          .executeTakeFirstOrThrow();
      })
    );

  return jsonResponse({ ...action, targets: targetNames });
};
