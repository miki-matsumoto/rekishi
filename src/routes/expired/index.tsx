import { lazy, Route } from "@tanstack/react-router";
import { rootRoute } from "../root";

export const expiredRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/expired",
  component: lazy(() => import("./Expired")),
});
