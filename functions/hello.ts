import { createWebCryptSession } from "webcrypt-session";
import { z } from "zod";

const sessionSchema = z.object({
  organization: z.string(),
});

export const onRequest: PagesFunction = async ({ request }) => {
  const webCryptSession = await createWebCryptSession(sessionSchema, request, {
    password: "IF4B#t69!WlX$uS22blaxDvzJJ%$vEh%",
  });
  console.log(webCryptSession.organization);
  return new Response("hello");
};
