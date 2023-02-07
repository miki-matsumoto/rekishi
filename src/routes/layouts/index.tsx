import { lazy, Outlet, Route } from "@tanstack/react-router";
import { rootRoute } from "src/routes/root";
import { Button } from "src/components/ui/button";
import { ChevronLeft } from "lucide-react";

const AuditLogLayout = () => (
  <div>
    <Header />
    <Outlet />
  </div>
);
const Header = () => (
  <div className="border-b-gray-200 border">
    <div className="my-0 mx-auto max-w-5xl h-16 flex justify-between items-center">
      <Button variant="outline" size="sm">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to App
      </Button>
      <small className="text-sm font-medium leading-none">
        Powerd by Rekishi
      </small>
    </div>
  </div>
);

export const layoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: AuditLogLayout,
});
