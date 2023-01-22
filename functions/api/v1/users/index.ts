import { z } from "zod";
import { nanoid } from "nanoid";
import { internalServerErrorResponse, jsonResponse } from "src/lib/response";
import { withValidation } from "src/lib/api-middleware/withValidation";

const postValidation = z.object({
  user_id: z.string().min(1),
  organization_id: z.string().min(1),
  name: z.string().optional(),
  avatar: z.string().optional(),
});

export const onRequestPost = withValidation(
  postValidation,
  async ({ data }) => {
    const { organization_id, name, avatar, user_id } = data.body;

    const { db } = data;

    const org = await db
      .selectFrom("organizations")
      .select("id")
      .where("organization_id", "=", organization_id)
      .executeTakeFirst();

    if (!org)
      return jsonResponse(
        {
          message: `No such organization '${organization_id}'`,
        },
        { status: 404 }
      );

    const result = await db
      .insertInto("users")
      .values({
        id: `user_${nanoid()}`,
        organization_id: org.id,
        user_id,
        avatar,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .onConflict((oc) =>
        oc.column("user_id").doUpdateSet({
          name: name,
          avatar: avatar,
          updated_at: new Date().toISOString(),
        })
      )
      .returning(["user_id", "name", "avatar", "created_at", "updated_at"])
      .executeTakeFirst();

    if (!result) return internalServerErrorResponse();

    return jsonResponse(result, { status: 200 });
  }
);
