import { z, ZodSchema } from "zod";
import { Env } from "src/lib/env";
import { Kysely } from "kysely";
import { jsonResponse } from "src/lib/response";
import { DB } from "src/lib/schema";

type Context<T extends ZodSchema = never> = EventContext<
  Env,
  string,
  { db: Kysely<DB>; body: z.infer<T> }
>;

export function withValidation<T extends ZodSchema>(
  schema: T,
  next: (context: Context<T>) => Response | Promise<Response>
) {
  return async (context: Context<T>) => {
    const json = await context.request.json();
    console.log(json);
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      const { issues } = parsed.error;
      return jsonResponse(
        {
          error: {
            path: issues[0].path,
            message: issues[0].message,
            code: issues[0].code,
          },
        },
        { status: 400 }
      );
    }

    context.data.body = parsed.data;
    return next(context);
  };
}
