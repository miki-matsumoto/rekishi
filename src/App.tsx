import {
  Outlet,
  RouterProvider,
  Link,
  createReactRouter,
  createRouteConfig,
} from "@tanstack/react-router";
import { AuditLogsPage } from "./pages/audit-logs";
import { ClientProvider } from "./lib/trpc";

// https://github.com/TanStack/router/issues/414
declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}

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
    <div className="font-inter">
      <ClientProvider>
        <RouterProvider router={router} />
      </ClientProvider>
    </div>
  );
}

export default App;
