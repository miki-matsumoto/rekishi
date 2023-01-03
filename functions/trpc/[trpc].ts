import { initTRPC } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export function createContext({ req }: FetchCreateContextFnOptions) {
  console.log(req);
  return { req };
}
export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
const appRouter = t.router({
  hello: t.procedure.query(async ({ ctx }) => {
    return { hello: "world" };
  }),
});

export type AppRouter = typeof appRouter;

export const onRequest: PagesFunction = async (context): Promise<Response> => {
  console.log(context.env);
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: context.request,
    router: appRouter,
    createContext: () =>
      createContext({
        req: context.request,
        ...context.env,
      }),
  });
};
