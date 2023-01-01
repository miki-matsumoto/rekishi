export const jsonResponse = (value: any, init: ResponseInit = {}) =>
  new Response(JSON.stringify(value), {
    headers: { "content-type": "application/json", ...init.headers },
    ...init,
  });
