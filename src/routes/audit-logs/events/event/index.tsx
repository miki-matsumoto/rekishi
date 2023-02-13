import { lazy, Route } from "@tanstack/react-router";
import { auditLogsRoute } from "../..";
import { fetchQueryClient, trpcClient } from "src/lib/trpc";

export const eventRoute = new Route({
  getParentRoute: () => auditLogsRoute,
  path: "$event",
  // onLoad: async ({ preload }) => await eventLoader.load({ preload }),
  component: lazy(() => import("./Event")),
});
