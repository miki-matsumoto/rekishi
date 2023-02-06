import { z } from "zod";
import { nanoid } from "nanoid";
import { internalServerErrorResponse, jsonResponse } from "src/lib/response";
import { withValidation } from "src/lib/api-middleware/withValidation";
import formatISO from "date-fns/formatISO";

const postInput = z.object({
  organization_id: z.string().min(1),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const onRequestPost = withValidation(postInput, async ({ data }) => {
  const { organization_id, name, avatar } = data.body;
  const { db } = data;

  console.log(formatISO(new Date()));

  const result = await db
    .insertInto("organizations")
    .values({
      id: `org_${nanoid()}`,
      organization_id,
      name,
      avatar,
      created_at: formatISO(new Date()),
      updated_at: formatISO(new Date()),
    })
    .onConflict((oc) =>
      oc
        .column("organization_id")
        .doUpdateSet({ name, avatar, updated_at: formatISO(new Date()) })
    )
    .returning([
      "organization_id",
      "name",
      "avatar",
      "created_at",
      "updated_at",
    ])
    .executeTakeFirst();

  if (!result) return internalServerErrorResponse();

  return jsonResponse(result);
});
