import { initTRPC } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Env } from "src/lib/env";
import { database } from "src/lib/db";

export async function createContext({
  req,
  env,
}: FetchCreateContextFnOptions & { env: Env }) {
  const db = database(env.DB);
  return { req, db };
}
export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
const appRouter = t.router({
  hello: t.procedure.query(async ({ ctx }) => {
    const d = await ctx.db.selectFrom("users").select("id").execute();
    return { hello: "world", d };
  }),
});

export type AppRouter = typeof appRouter;

export const onRequest: PagesFunction<Env> = async (context) =>
  fetchRequestHandler({
    endpoint: "/trpc",
    req: context.request,
    router: appRouter,
    createContext: () =>
      createContext({
        req: context.request,
        env: context.env,
      }),
  });
