import { z } from "zod";
import { nanoid } from "nanoid";
import { jsonResponse } from "src/lib/response";
import { withValidation } from "src/lib/api-middleware/withValidation";

const postInput = z.object({
  name: z.string().min(1),
});

export const onRequestPost = withValidation(postInput, async ({ data }) => {
  const { name } = data.body;
  const { db } = data;

  const existTarget = await db
    .selectFrom("targets")
    .where("name", "=", name)
    .selectAll()
    .executeTakeFirst();

  if (existTarget) return jsonResponse(existTarget);

  const result = await db
    .insertInto("targets")
    .values({
      id: `target_${nanoid()}`,
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirst();

  return jsonResponse(result);
});
