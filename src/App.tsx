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

const about = rootRoute.createRoute({
  path: "/not-found",
  component: () => <>not found</>,
});

const routeConfig = rootRoute.addChildren([auditLogs, about]);
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
