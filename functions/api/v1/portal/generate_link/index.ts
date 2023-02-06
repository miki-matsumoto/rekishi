import { z } from "zod";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { nanoid } from "nanoid";
import { jsonResponse } from "src/lib/response";
import { withValidation } from "src/lib/api-middleware/withValidation";
import formatISO from "date-fns/formatISO";

const postValidation = z.object({
  organization: z.string().min(1),
});

export const onRequestPost = withValidation(
  postValidation,
  async ({ request, data, env }) => {
    console.log("---------------------------");
    console.log(formatISO(new Date()));
    console.log(new Date());
    let timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(timeZone);
    console.log("---------------------------");
    const { organization } = data.body;
    const org = await data.db
      .selectFrom("organizations")
      .where("organization_id", "=", organization)
      .select("id")
      .executeTakeFirst();

    if (!org)
      return new Response(
        JSON.stringify({ messsage: `Organization: ${organization} not found` }),
        { headers: { "content-type": "application/json" } }
      );

    const key = `key_${nanoid()}`;
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 5);
    const timestamp = expiryDate.getTime() / 1000;

    await env.PORTAL_SESSION_EXPIRE_KEY.put(key, organization, {
      expiration: timestamp,
    });

    const token = await jwt.sign({ organization, key }, "secret");

    const requestUrl = new URL(request.url);
    return jsonResponse({
      url: `${requestUrl.origin}/?token=${token}`,
    });
  }
);
