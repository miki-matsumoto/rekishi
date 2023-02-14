import { database } from "src/lib/db";
import { Env } from "src/lib/env";

function getIdTokenFromReq(request: Request) {
  const idToken = request.headers.get("authorization");
  if (!idToken) return null;
  return idToken?.replace(/^Bearer (.*)/, "$1");
}

export const onRequest: PagesFunction<Env> = async ({
  next,
  data,
  env,
  request,
}) => {
  const token = getIdTokenFromReq(request);
  if (env.API_KEY !== token) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Invalid API Key provided",
        },
      }),
      {
        headers: { "content-type": "application/json" },
        status: 401,
      }
    );
  }

  const db = database(env.DB);
  data.db = db;
  return await next();
};
