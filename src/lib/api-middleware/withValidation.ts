import { z, ZodSchema } from "zod";
import { Database } from "src/lib/db";
import { Env } from "src/lib/env";
import { Kysely } from "kysely";
import { jsonResponse } from "src/lib/response";

type Context<T extends ZodSchema = never> = EventContext<
  Env,
  string,
  { db: Kysely<Database>; body: z.infer<T> }
>;

export function withValidation<T extends ZodSchema>(
  schema: T,
  next: (context: Context<T>) => Response | Promise<Response>
) {
  return async (context: Context<T>) => {
    const json = await context.request.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return jsonResponse({
        message: "Bad Request",
        issues: JSON.parse(parsed.error.message),
      });
    }

    context.data.body = parsed.data;
    return next(context);
  };
}
