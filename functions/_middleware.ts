import { Env } from "src/lib/env";
import { cryptoSession } from "src/lib/session";

export const onRequest: PagesFunction<Env> = async ({ next, request }) => {
  const url = new URL(request.url);
  const expiredUrl = `${url.origin}/expired`;
  const session = await cryptoSession(request);

  if (!session.organization && url.pathname.startsWith("/audit-logs"))
    return Response.redirect(expiredUrl, 302);

  if (
    session.organization &&
    (url.pathname.startsWith("/expired") ||
      url.pathname.startsWith("/not-found"))
  )
    return Response.redirect(`${url.origin}/audit-logs/events`, 302);

  return await next();
};
