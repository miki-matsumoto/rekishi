export const onRequest: PagesFunction = async ({ next, request }) => {
  return await next();
};
