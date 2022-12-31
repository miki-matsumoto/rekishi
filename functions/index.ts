import { database } from "src/lib/db";
import { Env } from "src/lib/env";
import jwt from "@tsndr/cloudflare-worker-jwt";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const notFoundUrl = `${url.origin}/not-found`;
  const searchParams = new URLSearchParams(url.search);

  const token = searchParams.get("token");
  if (!token) return Response.redirect(notFoundUrl);

  const isValid = await jwt.verify(token, "secret");
  if (!isValid) return Response.redirect(notFoundUrl);

  const { payload } = jwt.decode(token);
  const db = database(env.DB);

  const organization = await db
    .selectFrom("organizations")
    .select("id")
    .where("org_id", "=", payload.organization)
    .executeTakeFirst();

  if (!organization) return Response.redirect(notFoundUrl);

  return new Response(null, {
    status: 301,
    headers: {
      Location: `${url.origin}/audit-logs`,
      "Set-Cookie": "dummy=dummy",
    },
  });
};
