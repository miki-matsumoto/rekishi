import { lazy, Route } from "@tanstack/react-router";
import { layoutRoute } from "src/routes/layouts";
import { auditLogsRoute } from "../..";

export const eventRoute = new Route({
  getParentRoute: () => auditLogsRoute,
  path: "$event",
  component: lazy(() => import("./Event")),
});
