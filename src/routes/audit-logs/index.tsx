import { lazy, Outlet, Route } from "@tanstack/react-router";
import { layoutRoute } from "../layouts";
import AuditLogsPage from "./events/Events";

export const auditLogsRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: "audit-logs/events",
});