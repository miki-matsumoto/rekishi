import { lazy, Route } from "@tanstack/react-router";
import { rootRoute } from "../root";

export const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/not-found",
  component: lazy(() => import("./NotFound")),
});
