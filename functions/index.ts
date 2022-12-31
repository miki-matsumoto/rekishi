export const onRequestGet: PagesFunction = async ({ next, request }) => {
  const url = new URL(request.url);
  const notFoundUrl = `${url.origin}/not-found`;
  const searchParams = new URLSearchParams(url.search);

  if (!searchParams.has("token")) return Response.redirect(notFoundUrl);
  return await next();
};
