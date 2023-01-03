import { z } from "zod";
import { nanoid } from "nanoid";
import { jsonResponse } from "src/lib/response";
import { withValidation } from "src/lib/api-middleware/withValidation";

const postInput = z.object({
  org_id: z.string().min(1),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const onRequestPost = withValidation(postInput, async ({ data }) => {
  const { org_id, name, avatar } = data.body;
  const { db } = data;
  const result = await db
    .insertInto("organizations")
    .values({
      id: `org_${nanoid()}`,
      org_id,
      name,
      avatar,
    })
    .onConflict((oc) => oc.column("org_id").doUpdateSet({ name, avatar }))
    .returning(["org_id", "name", "avatar"])
    .executeTakeFirst();

  // TODO
  if (!result) throw new Error("Failed");

  return jsonResponse(result);
});
