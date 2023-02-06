import { TRPCError } from "@trpc/server";
import { cryptoSession } from "src/lib/session";
import { t } from "src/server/trpc";

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

    console.log({ events });
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
});

export type AppRouter = typeof appRouter;
