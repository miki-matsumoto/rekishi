import { z } from "zod";
import { database } from "src/lib/db";
import { nanoid } from "nanoid";
import { Env } from "src/lib/env";
import { jsonResponse } from "src/lib/response";

const postInput = z.object({
  action: z.string(),
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
  console.log({ user });

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
  console.log({ action });

  // validate target

  const context = await db
    .insertInto("context")
    .values({
      id: `context_${nanoid()}`,
      location: contextData.location,
      user_agent: contextData.user_agent,
    })
    .returningAll()
    .executeTakeFirst();

  if (!context) throw new Error("Error");

  const result = await db
    .insertInto("audit_logs")
    .values({
      id: `audit_log_event_${nanoid()}`,
      action_id: action.id,
      user_id: user.id,
      occurred_at: new Date().toString(),
      context_id: context.id,
    })
    .returningAll()
    .executeTakeFirst();

  if (!result) throw new Error("error");

  const log = await db
    .selectFrom("audit_logs")
    .where("audit_logs.id", "=", result.id)
    .innerJoin("context", "context.id", "audit_logs.context_id")
    .select(["audit_logs.id"])
    .executeTakeFirst();
  return jsonResponse(log);
};
