import "@tremor/react/dist/esm/tremor.css";
import { Button } from "@tremor/react";
import {
  Outlet,
  RouterProvider,
  Link,
  createReactRouter,
  createRouteConfig,
} from "@tanstack/react-router";

const rootRoute = createRouteConfig({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});

const auditLogs = rootRoute.createRoute({
  path: "/audit-logs",
  component: () => <>audit logs </>,
});

const notFound = rootRoute.createRoute({
  path: "/not-found",
  component: () => <>not found</>,
});

const expired = rootRoute.createRoute({
  path: "/expired",
  component: () => <>expired</>,
});

const routeConfig = rootRoute.addChildren([notFound, auditLogs, expired]);
const router = createReactRouter({ routeConfig });

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Button text="Button" />
    </>
  );
}

export default App;
