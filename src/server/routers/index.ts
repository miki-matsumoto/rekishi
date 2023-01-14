import { TRPCError } from "@trpc/server";
import { cryptoSession } from "src/lib/session";
import { t } from "src/server/trpc";

const isSession = t.middleware(async ({ ctx, next }) => {
  const session = await cryptoSession(ctx.request);
  if (!session.organization) throw new TRPCError({ code: "UNAUTHORIZED" });

  const organization = await ctx.db
    .selectFrom("organizations")
    .where("org_id", "=", session.organization)
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
      .where("organization_id", "=", ctx.organization.id)
      .selectAll()
      .execute();

    const user = await ctx.db
      .selectFrom("users")
      .where("organization_id", "=", ctx.organization.id)
      .orderBy("createdAt", "desc")
      .selectAll()
      .execute();
    return user;
  }),
});

export type AppRouter = typeof appRouter;
