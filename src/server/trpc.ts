import { initTRPC } from "@trpc/server";
import { Context } from "src/server/context";

export const t = initTRPC.context<Context>().create();
