export const onRequest: PagesFunction = async ({ next }) => {
  // return Response.redirect("https://google.com");
  return await next();
};
