import { t } from "src/server/trpc";

export const appRouter = t.router({
  hello: t.procedure.query(async ({ ctx }) => {
    const d = await ctx.db.selectFrom("users").select("id").execute();
    return { hello: "world", d };
  }),
});

export type AppRouter = typeof appRouter;
