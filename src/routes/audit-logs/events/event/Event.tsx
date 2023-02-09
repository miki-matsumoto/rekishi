import { Suspense } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "src/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function EventPage() {
  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <div className="my-8">
          <Button
            variant="link"
            size="sm"
            className="text-blue-600 font-normal p-0 hover:no-underline"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            <Link to="/audit-logs/events">Audit Logs</Link>
          </Button>
        </div>
        <Suspense fallback={<div>Loading... from suspense</div>}></Suspense>
      </div>
    </div>
  );
}
