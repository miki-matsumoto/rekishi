import { z } from "zod";
import { database } from "src/lib/db";
import { nanoid } from "nanoid";
import { Env } from "src/lib/env";
import { jsonResponse } from "src/lib/response";

const postInput = z.object({
  action: z.string(),
  // TODO: z.string() to z.date()
  occurred_at: z.string().optional(),
  actor: z.object({
    id: z.string(),
  }),
  targets: z.array(z.object({ id: z.string(), type: z.string() })),
  context: z.object({
    location: z.string().optional(),
    user_agent: z.string().optional(),
  }),
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

  const {
    actor,
    action: actionName,
    targets: targetObjects,
    occurred_at,
    context: contextData,
  } = parsed.data;
  const db = database(env.DB);

  // validate user
  const user = await db
    .selectFrom("users")
    .where("user_id", "=", actor.id)
    .selectAll()
    .executeTakeFirst();
  if (!user)
    return jsonResponse(
      { message: `User ${actor.id} not found` },
      { status: 404 }
    );

  // validate action
  const action = await db
    .selectFrom("actions")
    .where("name", "=", actionName)
    .selectAll()
    .executeTakeFirst();
  if (!action)
    return jsonResponse(
      { message: `Action: '${actionName}' not found.` },
      { status: 404 }
    );

  // validate target
  const targets = await db
    .selectFrom("targets_on_actions")
    .where("action_id", "=", action.id)
    .innerJoin("targets", "targets.id", "targets_on_actions.target_id")
    .selectAll()
    .execute();

  const nonExistTargets = targetObjects.filter(
    ({ type }) => !targets.map((target) => target?.name).includes(type)
  );

  if (nonExistTargets.length)
    return jsonResponse({
      message: `Targets: ${nonExistTargets
        .map(({ type }) => `'${type}'`)
        .join(",")} is not defined '${action.name}'.`,
    });

  // TODO: kysely transaction
  // https://github.com/aidenwallis/kysely-d1/issues/2
  const context = await db
    .insertInto("context")
    .values({
      id: `context_${nanoid()}`,
      location: contextData.location,
      user_agent: contextData.user_agent,
    })
    .returningAll()
    .executeTakeFirst();

  // TODO: Correct response
  if (!context) throw new Error("Error");

  const auditLog = await db
    .insertInto("audit_logs")
    .values({
      id: `audit_log_event_${nanoid()}`,
      action_id: action.id,
      user_id: user.id,
      occurred_at: occurred_at?.toString() ?? new Date().toString(),
      context_id: context.id,
    })
    .returningAll()
    .executeTakeFirst();

  // TODO: Correct response
  // TODO: transaction delete to context
  if (!auditLog) throw new Error("error");

  const eventTarget = await Promise.all(
    targetObjects.map(async ({ id, type }) => {
      const target = targets.find((target) => target.name === type);
      if (!target) return;

      return await db
        .insertInto("event_target")
        .values({ target_id: target.id, audit_log_id: auditLog.id, id })
        .returningAll()
        .executeTakeFirst();
    })
  );
  // TODO: Correct response
  // TODO: transaction delete to context and auditLog
  if (!eventTarget) throw new Error("Error");

  // TODO: Correct response
  const log = await db
    .selectFrom("audit_logs")
    .where("audit_logs.id", "=", auditLog.id)
    .innerJoin("context", "context.id", "audit_logs.context_id")
    .innerJoin("event_target", "event_target.audit_log_id", "audit_logs.id")
    .select([
      "audit_logs.id",
      "context.id as context_id",
      "audit_logs.user_id",
      "event_target.id as event_target_id",
    ])
    .executeTakeFirst();

  return jsonResponse(log);
};
