import { inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Env } from "src/lib/env";
import { database } from "src/lib/db";

export async function createContext({
  req,
  env,
}: FetchCreateContextFnOptions & { env: Env }) {
  const db = database(env.DB);
  return { request: req, db };
}
export type Context = inferAsyncReturnType<typeof createContext>;
