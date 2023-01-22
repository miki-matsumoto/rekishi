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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .onConflict((oc) =>
      oc
        .column("org_id")
        .doUpdateSet({ name, avatar, updated_at: new Date().toISOString() })
    )
    .returning(["org_id", "name", "avatar", "created_at", "updated_at"])
    .executeTakeFirst();

  if (!result)
    jsonResponse({
      status: 500,
      message: "Internal server error",
    });

  return jsonResponse(result);
});
