import { database } from "src/lib/db";
import { Env } from "src/lib/env";
import jwt from "@tsndr/cloudflare-worker-jwt";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  console.log(request.url);
  const url = new URL(request.url);
  const notFoundUrl = `${url.origin}/not-found`;
  const searchParams = new URLSearchParams(url.search);

  const token = searchParams.get("token");
  console.log({ token });
  if (!token) return Response.redirect(notFoundUrl);

  const isValid = await jwt.verify(token, "secret");
  console.log({ isValid });
  if (!isValid) return Response.redirect(notFoundUrl);

  const { payload } = jwt.decode(token);
  console.log({ payload });
  const expire = await env.PORTAL_SESSION_EXPIRE_KEY.get(payload.key);
  console.log(expire);
  if (!expire) return Response.redirect(notFoundUrl);

  const db = database(env.DB);

  const organization = await db
    .selectFrom("organizations")
    .select("id")
    .where("org_id", "=", payload.organization)
    .executeTakeFirst();

  console.log(organization);
  if (!organization) return Response.redirect(notFoundUrl);

  return new Response(null, {
    status: 301,
    headers: {
      Location: `${url.origin}/audit-logs`,
      "Set-Cookie": "dummy=dummy",
    },
  });
};
