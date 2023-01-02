import { z } from "zod";
import { database } from "src/lib/db";
import { nanoid } from "nanoid";
import { Env } from "src/lib/env";

const postInput = z.object({
  name: z.string().min(1),
  title: z.string().optional(),
});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const json = await request.json();
  const parsed = postInput.safeParse(json);

  if (!parsed.success)
    return new Response(
      JSON.stringify({
        message: "Bad Request",
        issues: JSON.parse(parsed.error.message),
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
};
