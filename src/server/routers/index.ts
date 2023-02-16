import { TRPCError } from "@trpc/server";
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
      .selectFrom("events")
      .where("events.organization_id", "=", ctx.organization.id)
      .innerJoin("users", "users.id", "events.user_id")
      .innerJoin("actions", "actions.id", "events.action_id")
      .select([
        "events.id",
        "occurred_at",
        // user
        "users.name as userName",
        "users.email as email",
        // action
        "actions.code as actionCode",
        "actions.title as actionTitle",
      ])
      .orderBy("occurred_at", "desc")
      .execute();

    return events.map((event) => ({
      id: event.id,
      occurredAt: event.occurred_at,
      user: {
        name: event.userName,
        email: event.email,
      },
      action: {
        title: event.actionTitle,
        code: event.actionCode,
      },
    }));
  }),
  findEventById: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db
        .selectFrom("events")
        .where("events.id", "=", input.eventId)
        .innerJoin("users", "users.id", "events.user_id")
        .innerJoin("actions", "actions.id", "events.action_id")
        .innerJoin("context", "context.id", "events.context_id")
        .innerJoin(
          "targets_on_actions",
          "targets_on_actions.action_id",
          "events.action_id"
        )
        .select([
          "events.id as id",
          "occurred_at",
          // user
          "users.name as userName",
          "users.email as email",
          // action
          "actions.code as actionCode",
          "actions.title as actionTitle",
          "actions.id as actionId",
          // context
          "context.location",
          "context.user_agent",
          "targets_on_actions.target_id as targetId",
        ])
        .executeTakeFirst();
      if (!event) throw new TRPCError({ code: "NOT_FOUND" });

      const targets = await ctx.db
        .selectFrom("event_target")
        .where("event_target.audit_log_id", "=", event.id)
        .innerJoin("targets", "targets.id", "event_target.target_id")
        .selectAll()
        .execute();

      const output: { name: string; count: number }[] = [];
      const map = new Map();

      for (const item of targets) {
        if (map.has(item.name)) {
          map.set(item.name, map.get(item.name) + 1);
        } else {
          map.set(item.name, 1);
        }
      }

      for (const [name, count] of map) {
        output.push({ name, count });
      }

      const res = {
        id: event.id,
        occurred_at: event.occurred_at,
        actor: {
          name: event.userName,
          email: event.email ?? "",
        },
        action: {
          title: event.actionTitle,
          name: event.actionCode,
        },
        context: {
          location: event.location,
          userAgent: event.user_agent,
        },
        targets: output,
      };

      return {
        ...res,
        json: JSON.stringify(
          {
            ...res,
            targets: targets.map((target) => ({
              id: target.event_target_id,
              name: target.name,
            })),
          },
          null,
          2
        ),
      };
    }),
});

export type AppRouter = typeof appRouter;
