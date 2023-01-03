import "@tremor/react/dist/esm/tremor.css";
import {
  Outlet,
  RouterProvider,
  Link,
  createReactRouter,
  createRouteConfig,
} from "@tanstack/react-router";
import { AuditLogsPage } from "./pages/audit-logs";
import { ClientProvider } from "./lib/trpc";

const rootRoute = createRouteConfig({
  component: () => <Outlet />,
});

const auditLogs = rootRoute.createRoute({
  path: "/audit-logs",
  component: () => <AuditLogsPage />,
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
    <ClientProvider>
      <RouterProvider router={router} />
    </ClientProvider>
  );
}

export default App;
