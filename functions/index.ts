import { database } from "src/lib/db";
import { Env } from "src/lib/env";
import jwt from "@tsndr/cloudflare-worker-jwt";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const notFoundUrl = `${url.origin}/not-found`;
  const expiredUrl = `${url.origin}/expired`;
  const searchParams = new URLSearchParams(url.search);

  const token = searchParams.get("token");
  if (!token) return Response.redirect(notFoundUrl, 302);

  const isValid = await jwt.verify(token, "secret");
  if (!isValid) return Response.redirect(notFoundUrl, 302);

  const { payload } = jwt.decode(token);
  const expire = await env.PORTAL_SESSION_EXPIRE_KEY.get(payload.key);
  if (!expire) return Response.redirect(expiredUrl, 302);

  const db = database(env.DB);

  const organization = await db
    .selectFrom("organizations")
    .select("id")
    .where("org_id", "=", payload.organization)
    .executeTakeFirst();

  console.log(organization);
  if (!organization) return Response.redirect(notFoundUrl, 302);

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${url.origin}/audit-logs`,
      "Set-Cookie": "dummy=dummy",
    },
  });
};
