import { TRPCError } from "@trpc/server";
import { cryptoSession } from "src/lib/session";
import { t } from "src/server/trpc";

const isSession = t.middleware(async ({ ctx: { request }, next }) => {
  const session = await cryptoSession(request);
  if (!session.organization) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next();
});

const protectedProcedure = t.procedure.use(isSession);

export const appRouter = t.router({
  hello: protectedProcedure.query(async ({ ctx }) => {
    const d = await ctx.db.selectFrom("users").select("id").execute();
    return { hello: "world", d };
  }),
});

export type AppRouter = typeof appRouter;
