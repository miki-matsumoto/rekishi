import { lazy, Route } from "@tanstack/react-router";
import { auditLogsRoute } from "../..";
import { Loader } from "@tanstack/react-loaders";
import { trpcClient } from "src/lib/trpc";

export const eventLoader = new Loader({
  key: 'event',
  loader: async () => await trpcClient.hello.query() 
})

export const eventRoute = new Route({
  getParentRoute: () => auditLogsRoute,
  path: "$event",
  onLoad: async ({preload}) => await eventLoader.load({preload}),
  component: lazy(() => import("./Event")),
});
