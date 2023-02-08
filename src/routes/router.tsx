import { rootRoute } from "src/routes/root";
import { ReactRouter } from "@tanstack/react-router";
import { eventRoute } from "./audit-logs/events/event";
import { layoutRoute } from "./layouts";
import { auditLogsRoute } from "./audit-logs";
import { eventsRoute } from "./audit-logs/events";
import { notFoundRoute } from "./not-found";
import { expiredRoute } from "./expired";

const routeTree = rootRoute.addChildren([
  notFoundRoute,
  expiredRoute,
  layoutRoute.addChildren([
    auditLogsRoute.addChildren([eventsRoute, eventRoute]),
  ]),
]);

export const router = new ReactRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
