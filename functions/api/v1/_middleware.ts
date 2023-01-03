import { database } from "src/lib/db";
import { Env } from "src/lib/env";

export const onRequest: PagesFunction<Env> = async ({ next, data, env }) => {
  const db = database(env.DB);
  data.db = db;
  return await next();
};
