import { lazy, Route } from "@tanstack/react-router";
import { auditLogsRoute } from "..";

export const eventsRoute = new Route({
  getParentRoute: () => auditLogsRoute,
  path: "/",
  component: lazy(() => import("./Events")),
});
