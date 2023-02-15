import { z } from "zod";
import { nanoid } from "nanoid";
import { internalServerErrorResponse, jsonResponse } from "src/lib/response";
import { withValidation } from "src/lib/api-middleware/withValidation";
import formatISO from "date-fns/formatISO";

const postValidation = z.object({
  user_id: z.string().min(1),
  organization_id: z.string().min(1),
  name: z.string().optional(),
  email: z.string().email(),
  avatar: z.string().optional(),
});

export const onRequestPost = withValidation(
  postValidation,
  async ({ data }) => {
    const { organization_id, name, email, avatar, user_id } = data.body;

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
        email,
        created_at: formatISO(new Date()),
        updated_at: formatISO(new Date()),
      })
      .onConflict((oc) =>
        oc.column("user_id").doUpdateSet({
          name: name,
          avatar: avatar,
          email,
          updated_at: formatISO(new Date()),
        })
      )
      .returning([
        "user_id",
        "name",
        "email",
        "avatar",
        "created_at",
        "updated_at",
      ])
      .executeTakeFirst();

    if (!result) return internalServerErrorResponse();

    return jsonResponse(result, { status: 200 });
  }
);
