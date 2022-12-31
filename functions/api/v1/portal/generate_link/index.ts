import { z } from "zod";
import { database } from "src/lib/db";
import { Env } from "src/lib/env";
import jwt from "@tsndr/cloudflare-worker-jwt";

const postValidation = z.object({
  organization: z.string().min(1),
});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // If empty request body, await request.json() throw "Unexpected token in JSON"
  const json = await request.text().then((res) => (res ? JSON.parse(res) : {}));
  // const json = await request.json();
  const parsed = postValidation.safeParse(json);

  if (!parsed.success)
    return new Response(
      JSON.stringify({
        message: "Bad Request",
        issues: JSON.parse(parsed.error.message),
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );

  const { organization } = parsed.data;
  const db = database(env.DB);
  const org = await db
    .selectFrom("organizations")
    .where("org_id", "=", parsed.data.organization)
    .select("id")
    .executeTakeFirst();

  if (!org)
    return new Response(
      JSON.stringify({ messsage: "Organization not found" }),
      { headers: { "content-type": "application/json" } }
    );

  const token = await jwt.sign({ organization }, "secret");

  const requestUrl = new URL(request.url);
  return new Response(
    JSON.stringify({
      url: `${requestUrl.origin}?token=${token}`,
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
};
