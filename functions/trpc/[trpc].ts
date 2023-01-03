import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Env } from "src/lib/env";
import { createContext } from "src/server/context";
import { appRouter } from "src/server/routers";

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
