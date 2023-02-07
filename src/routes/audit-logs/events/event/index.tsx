import { lazy, Route } from "@tanstack/react-router";
import { layoutRoute } from "src/routes/layouts";

export const eventRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: "audit-logs/events/$event",
  component: lazy(() => import("./Event")),
});
