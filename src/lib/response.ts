export const jsonResponse = (value: any, init: ResponseInit = {}) =>
  new Response(JSON.stringify(value), {
    headers: { "content-type": "application/json", ...init.headers },
    ...init,
  });

export const internalServerErrorResponse = (
  value?: any,
  init: ResponseInit = {}
) =>
  new Response(
    JSON.stringify({
      ...value,
      message: value?.message ?? "Internal server error",
    }),
    {
      headers: { "content-type": "application/json", ...init.headers },
      ...init,
      status: 500,
    }
  );
