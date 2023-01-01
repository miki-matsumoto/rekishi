import { createWebCryptSession } from "webcrypt-session";
import { z } from "zod";

const sessionSchema = z.object({
  organization: z.string(),
});

export const cryptoSession = async (request: Request) =>
  await createWebCryptSession(sessionSchema, request, {
    password: "IF4B#t69!WlX$uS22blaxDvzJJ%$vEh%",
  });
