import { TRPCError } from "@trpc/server";
import { sql } from "kysely";
import { cryptoSession } from "src/lib/session";
import { t } from "src/server/trpc";
import { z } from "zod";

const isSession = t.middleware(async ({ ctx, next }) => {
  const session = await cryptoSession(ctx.request);
  if (!session.organization) throw new TRPCError({ code: "UNAUTHORIZED" });

  const organization = await ctx.db
    .selectFrom("organizations")
    .where("organization_id", "=", session.organization)
    .selectAll()
    .executeTakeFirst();
  if (!organization) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({ ctx: { ...ctx, organization, session } });
});

const protectedProcedure = t.procedure.use(isSession);

export const appRouter = t.router({
  hello: protectedProcedure.query(async ({ ctx }) => {
    const d = await ctx.db.selectFrom("users").select("id").execute();
    return { hello: "world", d };
  }),
  auditLogEvents: protectedProcedure.query(async ({ ctx }) => {
    const events = await ctx.db
      .selectFrom("audit_logs")
      .where("audit_logs.organization_id", "=", ctx.organization.id)
      .innerJoin("users", "users.id", "audit_logs.user_id")
      .innerJoin("actions", "actions.id", "audit_logs.action_id")
      .select([
        "audit_logs.id",
        "occurred_at",
        // user
        "users.name as userName",
        // action
        "actions.name as actionName",
        "actions.title as actionTitle",
      ])
      .orderBy("occurred_at", "desc")
      .execute();

    return events.map((event) => ({
      id: event.id,
      occurred_at: event.occurred_at,
      user: {
        name: event.userName,
      },
      action: {
        title: event.actionTitle,
        name: event.actionName,
      },
    }));
  }),
  findEventById: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db
        .selectFrom("audit_logs")
        .where("audit_logs.id", "=", input.eventId)
        .innerJoin("users", "users.id", "audit_logs.user_id")
        .innerJoin("actions", "actions.id", "audit_logs.action_id")
        .innerJoin("context", "context.id", "audit_logs.context_id")
        .select([
          "audit_logs.id",
          "occurred_at",
          // user
          "users.name as userName",
          // action
          "actions.name as actionName",
          "actions.title as actionTitle",
          // context
          "context.location",
          "context.user_agent",
        ])
        .executeTakeFirst();
      if (!event) throw new TRPCError({ code: "NOT_FOUND" });

      const d = await ctx.db
        .selectFrom(["actions", "targets"])
        .where("actions.id", "=", "action_wDRNZtVF_oLmhcJov8XRi")
        .select([
          "actions.id as id",
          (eb) =>
            sql`group_concat(json_object(${sql.literal("id")}, ${eb.ref(
              "targets.id"
            )}))`.as("target"),
        ])
        .groupBy("actions.id")
        .executeTakeFirst();
      console.log(d);
      console.log(JSON.parse(`[${d?.target}]`));

      return {
        id: event.id,
        occurred_at: event.occurred_at,
        user: {
          name: event.userName,
        },
        action: {
          title: event.actionTitle,
          name: event.actionName,
        },
        context: {
          location: event.location,
          userAgent: event.user_agent,
        },
      };
    }),
});

export type AppRouter = typeof appRouter;
